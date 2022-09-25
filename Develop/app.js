//dependencies
const fs = require('fs'); 
const express = require('express'); // << express is what runs the server
const path = require('path');
const uuid = require('uuid'); // << to give unique ids to notes

const database = require('./db/db.json');
const { request } = require('http');
const { json } = require('express');
let jsonFile = path.join(__dirname, '/db/db.json');

// server instance (app is server reference/express)
const app = express(); 
const PORT = process.env.PORT || 3001;  // localhost: port (3001)

// hotel > app
// floor > port
// room > file


// middleware
app.use(express.static('public'));
// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());




// == routes ==
    // html routes
// index
app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
  );
// notes
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
  );


// api routes (json)

// get/api/notes
    // get db json
app.route("/api/notes").get(function(req, res){
    console.log("get notes", database)
    res.json(database)
})

// get/api/notes/id
    // get single note
app.route("/api/notes/:id").get(function(req, res){
    console.log('Get Request Id:', req.params.id);
})



// post /api/notes
app.route("/api/notes").post(function(req, res){
    // make an new note object
    var note = {
        title: req.body.title,
        text: req.body.text,    
        id: uuid.v4() // creates unique id
    }
    // push new note to json db (array)
    database.push(note)
    // write new json db file (update)
    fs.writeFile(jsonFile,JSON.stringify(database), function(err){
        if(err){
            return console.log(err)
        }else{
            console.log('poggers')
        }
    })
    // res json db
    res.json(note)
})


// delete bonus
// delete api/notes/:id
app.route("/api/notes/:id").delete(function(req, res){
    console.log('Delete Request Id:', req.params.id);
    // for loop / search for id
    for (let i=0; i<database.length; i++){
        console.log(database[i])
        // if id == search param id then splice from array (delete)
        if(database[i].id === req.params.id){
            database.splice(i,1);    // array.splice(start, delete count)
        }
    }
    // write new json db file (update)
    fs.writeFile(jsonFile,JSON.stringify(database), function(err){
        if(err){
            return console.log(err)
        }else{
            console.log('bye.')
        }
    })
    // res json db
    res.json(database)
    
})
    
app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
  );

 

//listening to set up the server.
app.listen(PORT, () => console.log(`App listening on port ${PORT}`));

// $ node app.js