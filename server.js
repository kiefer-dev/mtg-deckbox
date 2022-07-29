const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

// Activate body-parser to parse text submitted in the html form
app.use(bodyParser.urlencoded({ extended: true }));

// Create the server that browsers can connect to
app.listen(PORT, function() {
  console.log(`listening on ${PORT}`);
})

//---------------------------------------------------------------

// READ / GET
// When requesting the root directory, serve the main page (/index.html)
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html'); // __dirname is the current directory
})



// CREATE / POST
app.post('/deck', (req, res) => {
  console.log(req.body);
})







