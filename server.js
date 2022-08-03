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
    const cardCollection = db.collection('cards'); //create collection for cards

    // Tell Express that we're using EJS as the template engine
    app.set('view engine', 'ejs');
    // Tell Express that we're looking at the public folder
    app.use(express.static('public'));
    // Activate body-parser to parse text submitted in the html form
    app.use(bodyParser.urlencoded({ extended: true }));
    // Tell the server how to read JSON
    app.use(bodyParser.json());


    //----------------------
    // READ / GET
    // When requesting the root directory, serve the main page (/index.html)
    app.get('/', (req, res) => {
      // Create an array with each of the cards in the collection
      db.collection('cards').find().toArray()
        .then(results => {
          res.render('index.ejs', { cards: results }); //render the results of the cards into index.ejs
        })
        .catch(error => console.error(error));
    })


    //----------------------
    // CREATE / POST
    // When you click the Add Card button, insert the specified card (deckID and cardID) into the cardCollection MongoDB collection
    app.post('/deck', (req, res) => {
      cardCollection.insertOne(req.body)
        .then(result => {
          res.redirect('/');
        })
        .catch(error => console.error(error))
    })


    //----------------------
    // UPDATE / PUT
    app.put('/cards', (req, res) => {
      cardCollection.findOneAndUpdate(
        { deckID: 'deck2' },  //query
        { //update
          $set: {
            // Set the deckID and cardID to the ones included in the body of the request made in the button event listener in main.js
            deckID: req.body.deckID,
            cardID: req.body.cardID
          }
        },
        { //options
          upsert: true  //"insert a document if no documents can be updated"
        }
      )
      .then(result => {
        res.json('Success')
      })
      .catch(error => console.error(error))
    })


    //----------------------
    // DELETE / DELETE
    app.delete('/cards', (req, res) => {
      cardCollection.deleteOne(
        { cardID: req.body.cardID }, //query for the cardID passed from the fetch in main.js
      )
      .then(result => {
        if (result.deletedCount === 0) {
          return res.json('No card to delete');
        }
        res.json('Deleted card with 0 ID')
      })
      .catch(error => console.error(error))
    })


    //----------------------
    // Create the server that browsers can connect to
    app.listen(PORT, function() {
      console.log(`listening on ${PORT}`);
    })
  })
  .catch(error => console.error(error));













