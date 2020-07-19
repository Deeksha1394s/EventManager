Databse named "Events" consist of 3 collections:

1) counters : this collection helps assign userId and eventId to new users and events that are created        respectively.Where initial "sequence" value is fixed to 0.This value increments with each new user/event.
/* 1 */
{
	"_id" : "userId",
	"sequence" : 0 
},

/* 2 */
{
	"_id" : "eventId",
	"sequence" : 0  
}

2) users : this collection contains user details.
/* 1 createdAt:7/20/2020, 2:28:50 AM*/
{
	"_id" : ObjectId("5f14b40ad680e93d946d53d6"),
	"emailId" : "deeksha.sharma@gmail.com",
	"password" : "$2b$10$/CX2Ar.Yef32JZYexp3RHerWt2silXD265/t.mTVHCWxpXnkfS35m",
	"firstName" : "Deeksha",
	"lastName" : "Sharma",
	"dob" : ISODate("1994-11-13T00:00:00.000+05:30"),
	"gender" : "female",
	"userId" : 5
},

/* 2 createdAt:7/20/2020, 1:59:59 AM*/
{
	"_id" : ObjectId("5f14ad4737b2313d94092076"),
	"emailId" : "anmol.arora@gmail.com",
	"password" : "$2b$10$MBD5cnomSpJ0gyHzYY0bTOqOVuDiiDmNLa6Wqzr7PY4oFoRh3QvAu",
	"firstName" : "Anmol",
	"lastName" : "sharma",
	"dob" : ISODate("1994-09-10T00:00:00.000+05:30"),
	"gender" : "male",
	"userId" : 4
}

3) events: This collection saves event details. "participants" is an array composed of IDs of all the users participating.It also consist of a key "userId" which indicates the id of user who created that event.
{
	"_id" : ObjectId("5f14b347d680e93d946d53d5"),
	"title" : "ART ATTACK",
	"description" : "paint your heart out",
	"date" : ISODate("2019-11-19T10:09:28.271+05:30"),
	"place" : "CP",
	"maxParticipants" : 3,
	"userId" : 4,
	"participants" : [
		5
	],
	"time" : "10:09:28 GMT+0530 (India Standard Time)",
	"eventId" : 10
}


To authorize users, a json web token has been used. Once a user logs in , he will get a jwt token. A middleware will check for this jwt in the request header and decode it. A user will not be authorized in case the token cannot be decoded or is not present at all.


The achitecture is divided into 2 main folders:
1) common : This has all the middleware, database and configuration utilities
   a) config : contains sever host:port configurations , database configuration and secret key used to create jwt
   b) database : contains mongodb util, to perform basic mongo queries on database
   c) utils : contains verfication token middleware and a multer middleware
2)microservice: This has a server.js and rest of the files to handle requests
   a) event-route.js : routes the request to appropriate controller handler(function)
   b) event-controller.js : performs basic operations on the request body and forwards the new data to appropriate service handler
   c) event-service.js : creates appropriate mongo queries and calls mongodb-util.js handlers to fetch/create/update/remove data
