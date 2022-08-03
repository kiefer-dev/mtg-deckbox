// Click event on button to search for cards
document.getElementById('buttonCardSearch').addEventListener('click', getCard);

let resultCount = 0; //to hold amount of results
let resultArray = []; //to hold card results

function getCard() {
  // Take whether the search term is for card name or card subtype
  const nameOrSubtype = document.getElementById('selectNameOrSubtype').value;

  // Take the input search term and sanitize it for API use
  const inputSearch = document.getElementById('inputCardSearch').value.split(" ").join("%20");

  // Create the fetch url to search for cards with the supplied name/subtype and that contains a card image.
  let url = `https://api.magicthegathering.io/v1/cards?${nameOrSubtype}=${inputSearch}&contains=imageUrl&colors=`;
  // Add the colors to the end of the above url
  let colorArray = ["black", "white", "red", "green", "blue"];
  colorArray.forEach(color => {
    if (document.getElementById(`${color}`).checked === true) {
      url += `${color}|`
    }
  })
  console.log(url);


  // Store the Converted Mana Cost selection
  const cmcSelection = document.getElementById('selectCMC').value;

  // Clear the results list on button click
  document.querySelector('#cardImageArea').innerHTML = '';

  // Clear the results count on button click
  resultCount = 0;

  // API fetch
  fetch(url)
    .then(res => res.json()) //parse response as JSON
    .then(data => {
      // Store cards into resultArray
      if (cmcSelection) { //if a converted mana cost has been selected
        cmcSelection === '10+'
          ? resultArray = data.cards.filter(card => card.cmc >= 10) //if 10+
          : resultArray = data.cards.filter(card => card.cmc == cmcSelection) //if 0-9
      } else { //if a converted mana cost has not been selected
        resultArray = data.cards;
      }

      // If no colors are selected, filter the resultArray to contain only cards without a colors/colorIdentity property
      if (url[url.length - 1] === '=') {
        resultArray = resultArray.filter(card => !("colors" in card) && !("colorIdentity" in card))
      }

      console.log(inputSearch);
      console.log(resultArray);

      // Remove the .hidden class from the cardAddArea
      document.querySelector('#cardImageArea').classList.remove('hidden');

      resultArray.forEach(card => {
        // Create image element to add to DOM
        const img = document.createElement('img'); 

        // Set img's src to the current card's imageUrl
        img.src = card.imageUrl; 

        // Add the card image to the DOM in the #cardImages section
        document.querySelector('#cardImageArea').appendChild(img); 

        // Increment count of results for each valid card found
        resultCount++; 
      })

      // Put result count into the DOM in #numberOfResults
      resultCount >= 100
        ? document.getElementById('numberOfResults').innerText = "100+ results found, please be more specific!"
        : document.getElementById('numberOfResults').innerText = `${resultCount} results found`;
      

    })
}


// Click event on colorless button to clear all other color checkboxes
document.querySelector('#colorless').addEventListener('click', clearColors);
// Function that removes checks from all other color boxes
function clearColors() {
  const colorArray = ['black', 'white', 'red', 'green', 'blue'];
  colorArray.forEach(color => document.getElementById(`${color}`).checked = false);
}


// Card Update button (PUT request)
// const update = document.querySelector('#update-button');
// update.addEventListener('click', _ => {
//   fetch('/cards', {
//     method: 'put', //making a PUT request
//     headers: { 'Content-Type': 'application/json' }, //tell server we're sending JSON data
//     body: JSON.stringify({
//       deckID: 'deck1',
//       cardID: 0
//     })
//   })
//   .then(res => {
//     if (res.ok) return res.json()
//   })
//   .then(response => {
//     console.log(response);
//   })
// })


// Card Delete button (DELETE request)
const deleteButton = document.querySelector('#delete-button');
deleteButton.addEventListener('click', _ => {
  fetch('/cards', {
    method: 'delete', //making a DELETE request
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      cardID: document.querySelector('#deleteCardID').value
    })
  })
  .then(res => {
    if (res.ok) return res.json();
  })
  .then(data => {
    window.location.reload();
  })
})