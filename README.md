# ssf-day10
Final Day Assessment

**Requirement 1 - Search for Multiple Books By Title or Author**
----
  Returns json data for a maximum of 10 books.
  
  To search by title, include the title param.
  To search by author, include the author param.
  To search by both, include both title and author param.
  To sort ascending or descending title or author, include sort and respective sort fields.

* **URL**

  /api/books

* **Method:**

  `GET`
  
* **URL Params**

  None

* **Data Params**

  
     **Optional:**
 
   `title=[string]`<br>
   `author=[string]`<br>
   `offset=[integer]`<br>
   `sort=[ASC | DESC]`<br>
   `field=[title | author_firstname | author_lasttname]`<br>
   

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** 
```
 [
     {
         "id": 1,
         "author_lastname": "Leigh",
         "author_firstname": "Susannah",
         "title": "The Haunted Tower",
         "cover_thumbnail": "the_haunted_tower.jpg"
     }
]

```
* **Error Response:**

  * **Code:** 404 NOT FOUND <br />
    **Content:** `{ error : "Book doesn't exist" }`


**Requirement 2 - Search for Single Book**
----
  Returns json data for a 1 book.

* **URL**

  /api/books/:id

* **Method:**

  `GET`
  
*  **URL Params**

   **Required:**
 
   `id=[integer]`

* **Data Params**

  None
  

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** 
```
 [
     {
         "id": 1,
         "author_lastname": "Leigh",
         "author_firstname": "Susannah",
         "title": "The Haunted Tower",
         "cover_thumbnail": "the_haunted_tower.jpg",
         "modified_date": "2016-07-25T16:00:00.000Z",
         "created_date": "2016-07-25T16:00:00.000Z",
         "is_deleted": 0
     }
]

```
* **Error Response:**

  * **Code:** 404 NOT FOUND <br />
    **Content:** `{ error : "Book doesn't exist" }`

