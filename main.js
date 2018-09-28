require('dotenv').config()
const express =  require("express"),
      mysql = require("mysql"),
      q = require("q"),
      path = require("path"),
      bodyParser = require("body-parser");

//Create an instance of express
const app = express();

//Serve static resources
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: process.env.DB_CONLIMIT
    //debug: true
})

var makeQuery = (sql, pool)=>{
    console.log(sql);
    
    return  (args)=>{
        var defer = q.defer();
        pool.getConnection((err, connection)=>{
            if(err){
                defer.reject(err);
                return;// return goes back to line 50 defer.promise
            }
            console.log('args:', args);
        
            connection.query(sql, args || [], (err, results)=>{
                connection.release();
                if(err){
                    defer.reject(err);
                    return;
                }
                //console.log(">>> "+ results);
                defer.resolve(results); 
            })
        });
        return defer.promise;
    }
}

// Book List SQLs
const sqlFindAllBooks = 'SELECT * FROM books order by ';
const sqlFindBooksByAuthor = 'SELECT * FROM books where author_lastname like ? or author_firstname like ? order by ';
const sqlFindBooksByTitle = "SELECT * FROM books where title like ? order by ";
const sqlFindBooksByAuthorTitle = 'SELECT * FROM books where title like ? and (author_lastname like ? or author_firstname like ?) order by '
const sqlFindOneBookById = 'SELECT * FROM books where id = ?';

const sortFirstName = 'author_firstname';
const sortLastName = 'author_lastname';
const sortTitle= 'title';

const asc = ' ASC limit ?, 10';
const desc = ' DESC limit ?, 10';

function makeLikeParam (str) {
    if (str == undefined || str == '') {
        return '%%';
    }
    return '%' + str + '%';
}

function constructSqlArr(title, author, sortOrder,  sortField, offset) {
    let sqlFindBooks = '';
    let param = [];

    if (sortOrder == undefined) {
        sortOrder = 'ASC';
    }
    if (sortField == undefined) {
        sortField = 'title';
    }

    if (offset == undefined) {
        offset = 0;
    }

    offset = parseInt(offset);

    if ((author == undefined || author == '') && (title == undefined || title == '')) {
        sqlFindBooks = sqlFindAllBooks;       
        param = [offset] ;
    }
    else if (author == undefined || author == '') {
        // search by title
        sqlFindBooks = sqlFindBooksByTitle;
        param = [makeLikeParam(title), offset];        
    }
    else if (title == undefined || title == '') {
        // search by author
        sqlFindBooks = sqlFindBooksByAuthor;
        author = makeLikeParam(author);
        param = [makeLikeParam(author), makeLikeParam(author), offset];
    }
    
    else {
        // search by title and author
        sqlFindBooks = sqlFindBooksByAuthorTitle;
        param = [makeLikeParam(title), makeLikeParam(author), makeLikeParam(author), offset];
    } 

    switch (sortField.toUpperCase()) {
        case sortFirstName.toUpperCase():
            sqlFindBooks +=  sortFirstName;
            break;
        case sortLastName.toUpperCase():
            sqlFindBooks += sortLastName;
            break;
        default:
            sqlFindBooks += sortTitle;
            break;

    }
    
    if (sortOrder.toUpperCase() == 'DESC') {
        sqlFindBooks += desc;
    }
    else {
        sqlFindBooks += asc;
    }
    
    return [sqlFindBooks, param];
}

//Create API  routes

// api/books?title
app.get("/api/books", (req, res)=>{
    let title = req.query.title;
    let author = req.query.author;
    let sortOrder = req.query.sort; // sort asc or desc
    let sortField = req.query.field; // by author or title    
    let offset = req.query.offset;
    
    console.log(`/api/books: ${author} - ${title} - ${sortOrder} - ${sortField}`);
    let sqlArr = constructSqlArr(title, author, sortOrder, sortField, offset);
    let sql = sqlArr[0];
    let param = sqlArr[1];
    const findBooks = makeQuery(sql, pool);
    const data = [];
    findBooks(param).then((results)=>{
        for (let result of results) {
            data.push({
                id: result.id,
                title:result.title, 
                author_firstname:result.author_firstname, 
                author_lastname:result.author_lastname,
                cover_thumbnail: result.cover_thumbnail
            });
        }
        res.status(200).json(data);
    }).catch((error)=>{
        console.log(error);
        res.status(500).json(error);
    });
   
});

//api/book/1
app.get("/api/book/:bookId", (req, res)=>{
    var bookId = req.params.bookId;
        
    const findOneBookById = makeQuery(sqlFindOneBookById, pool);
    findOneBookById([parseInt(bookId)]).then((results)=>{
        if (results.length > 0) {
            res.json(results);
        }
        else {
            res.status(404).json({error: "Book doesn't exist"});
        }
    }).catch((error)=>{
        res.status(500).json(error);
    })
    
});

//Start server
const PORT = parseInt(process.argv[2]) || parseInt(process.env.APP_PORT) || 3000;
app.listen(PORT, () => {
    console.info(`Application running on port ${PORT}`);
});
