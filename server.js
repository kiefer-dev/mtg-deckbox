const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const dotenv = require('dotenv'); //.env file for config
const { response } = require('express');
dotenv.config({ path: './config/config.env' }) // Load config
const PORT = process.env.PORT || 3000;


//----------------------
// Connect to MongoDB
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'mtg-deck-saver'

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
  .then(client => {
    console.log(`Connected to ${dbName} database on MongoDB!`);
    db = client.db(dbName)
  })


//----------------------
// Middleware
app.set('view engine', 'ejs'); // Tell Express that we're using EJS as the template engine
app.use(express.static('public')); // Tell Express that we're looking at the public folder
app.use(bodyParser.urlencoded({ extended: true })); // Activate body-parser to parse text submitted in the html form
app.use(bodyParser.json()); // Tell the server how to read JSON


//----------------------
// GET / Read
// When requesting the root directory, serve the main page (/index.html)
app.get('/', async (req, res) => {
  const cardsInDB = await db.collection('cards').find().toArray(); //find all the cards in the 'cards' collection and put them in the cardsInDB array
  const cardCount = await db.collection('cards').countDocuments(); //count total amount of cards (currently in all decks)

  db.collection('cards').find().toArray() //find ALL documents in the cards collection, and put them in an array 
    .then(cardResults => {
      res.render('index.ejs', { cards: cardResults, cardsCount: cardCount }) //render index.ejs, passing "cardResults" (all of the objects that are inside the array) under the name "cards". Whenever you see "cards" in ejs that's our array of documents!
    })
    .catch(error => console.error(error))
})


//----------------------
// POST / Create
// When you click the Add Card button, insert the specified card (deckID and cardID) into the db.collection('cards') MongoDB collection
app.post('/addCard', (req, res) => {
  db.collection('cards').insertOne(req.body) //req.body reads everything in the body of the POST form (the deckID from the select element, and the cardID from the input element)
    .then(result => {
      res.redirect('/'); //reload the page
    })
    .catch(error => console.error(error))
})


//----------------------
// DELETE / Delete
app.delete('/deleteCard', (req, res) => {
  db.collection('cards').deleteOne({ 
    // Delete the card where the deckID matches the deckIDFromJS set in main.js, and the cardID matches the cardIDFromJS 
    deckID: req.body.deckIDFromJS,
    cardID: req.body.cardIDFromJS
  })
  .then(result => {
    console.log('Card Deleted')
    res.json('Card Deleted')
  })
  .catch(err => console.error(err))
})


//----------------------
// Create the server that browsers can connect to
app.listen(PORT, function() {
  console.log(`listening on ${PORT}`);
})
  














