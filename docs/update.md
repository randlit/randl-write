# /update
Update an item that is in the Randl database.



## Authentication

`write`



## Method

`POST`



## Arguments

**api_key** `required`

Your `api_key` for the Randl API.


**uuid** `required`
  
The `uuid` of the item, that is supposed to be updated.


**description** `optional`

The `description` will replace the old one.



## Error Codes

- `200` Ok

- `401` Unauthorized

- `500` Internal Server Error