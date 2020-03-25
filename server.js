'use strict';

// Load Environment Variables from the .env file
require('dotenv').config();
//this will let u talk to your database
const pg = require('pg');
//let u connect to your database
const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', error => {throw error;})

// Application Dependencies
const express = require('express');

// Application Setup
const PORT = process.env.PORT;
const server = express();

// Routes
server.get('/', (request, response) => {
  response.status(200).send('Hi Class');
});

//to get all the people we add to our database and render them
server.get('/people', (request, response) => {
  // SQL query
  //go to the database read the items
  let sql = `SELECT * FROM people`;
  //the client is the var who present our database
//run this query'sql' to my database then do something
  client.query(sql)
  .then((data)=>{
    //heek we get all the data
    // console.log(data);

    // console.log(data.rows);
    //e7na bedna aldata 3ala shaakel json
    response.status(200).json(data.rows);
  });
});

//heek to add data

server.get('/add', (request, response) => {
  //i need to send first and last name
  let first = request.query['first'];
  let last = request.query['last'];
  // console.log(first, last);

  //im ging to insert the data in my database
 // let sql = `INSERT INTO people(first_name, last_name) VALUES ('${first}',' ${last}') RETURNING *`;
//beleshi eli katabto abel ra7 awajeh moshkeleh be alstrings fa ba3mel heek
//for such a safer way  
let sql = `INSERT INTO people(first_name, last_name) VALUES ($1, $2) RETURNING *`;
  //query data is the data i wan to insert
  //heek first ra7 troo7 makan ra8am 1 and last 7atroo7 makan ra8am 2
  let queryData = [first, last];
  client.query(sql,queryData)  //  client.query(sql) heek kanat abel

  .then((data)=>{
    response.status(200).send("Worked");
  });

});



// Error Handler Routes
server.use('*', (request,response) => {
    response.status(404).send('huh?');
});

server.use((error, request, response) => {
  response.status(500).send(error);
});

//connect to database then do some stuff
client.connect()
.then( () => {
  //if the connection works start listening
  server.listen(PORT, () => console.log('Server up on', PORT));
})
//and if an error happens catch it
.catch(err => {
  throw `Error happend ${err}`;
});

