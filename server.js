const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;



// Connect to MongoDB through its connect method
const MongoClient = require('mongodb').MongoClient;
const connectionString = 'mongodb+srv://kiefer:weis@cluster0.yhggoed.mongodb.net/?retryWrites=true&w=majority'
MongoClient.connect(connectionString, { useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to mongoDB!');
    const db = client.db('mtg-deck-saver')
    const deck1Collection = db.collection('deck1'); //create collection for deck1
    
    // Activate body-parser to parse text submitted in the html form
    app.use(bodyParser.urlencoded({ extended: true }));

    // READ / GET
    // When requesting the root directory, serve the main page (/index.html)
    app.get('/', (req, res) => {
      db.collection('deck1').find().toArray()
        .then(results => {
          console.log(results)
        })
        .catch(error => console.error(error));

      res.sendFile(__dirname + '/index.html'); // __dirname is the current directory
    })

    // CREATE / POST
    app.post('/deck', (req, res) => {
      deck1Collection.insertOne(req.body)
        .then(result => {
          res.redirect('/');
        })
        .catch(error => console.error(error))
    })

    // Create the server that browsers can connect to
    app.listen(PORT, function() {
      console.log(`listening on ${PORT}`);
    })
  })
  .catch(error => console.error(error));













