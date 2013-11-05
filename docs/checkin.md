# /checkin
Performance a checkin on an item. Can only be done with items that are currently checked out.



## Authentication

`write`



## Method

`POST`



## Arguments

**api_key** `required`

Your API key for Randl API.


**uuid** `required`
  
The `uuid` of the item that is supposed to be checked in.



## Error Codes

- `200` Ok

- `401` Unauthorized

- `500` Internal Server Error