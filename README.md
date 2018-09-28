# ssf-day10
Final Day Assessment

**Search for Single Book**
----
  Returns json data for a maximum of 10 books.

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
    **Content:** `[{ id : 12, title : "Girls to Total Goddesses", author : " Sue, Lim", thumbnail: "no_book_cover.jpg"}, {id: 63, title: "Bad Girls", author: "Anthony", thumbnail: "no_book_cover.jpg"}]`
 
* **Error Response:**

  * **Code:** 404 NOT FOUND <br />
    **Content:** `{ error : "User doesn't exist" }`

  OR

  * **Code:** 401 UNAUTHORIZED <br />
    **Content:** `{ error : "You are unauthorized to make this request." }`

