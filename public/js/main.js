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
document.querySelector('#colorless').addEventListener('click', _ => {
  const colorArray = ['black', 'white', 'red', 'green', 'blue'];
  colorArray.forEach(color => document.getElementById(`${color}`).checked = false);
})



// DELETE card request
// Store all delete buttons into array
const deleteButton = document.querySelectorAll('.fa-trash');
// Add event listeners to each of the delete buttons
Array.from(deleteButton).forEach((element) => {
  element.addEventListener('click', deleteCard);
})
// DELETE
async function deleteCard(){
  const deckID = this.parentNode.childNodes[3].innerText //store the deckID of the clicked item
  const cardID = this.parentNode.childNodes[7].innerText //store the cardID of the clicked item

  try {
    const response = await fetch('deleteCard', {
      method: 'delete',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        'deckIDFromJS': deckID, //send the deckID as 'deckIDFromJS'
        'cardIDFromJS': cardID  //send the cardID as 'cardIDFromJS'
      })
    })
    const data = await response.json();
    console.log(data);
    location.reload();
  } catch(err) {
    console.log(err);
  }
}

// deleteButton.addEventListener('click', _ => {
//   // Clear delete message field on button press
//   document.querySelector('#deleteMessage').innerText = "";
//   // Save inputted deckID and cardID
//   deckID = document.querySelector('#deleteDeckID').value;
//   cardID = document.querySelector('#deleteCardID').value;

//   if (deckID && cardID) { //if both fields are populated
//     fetch('/cards', {
//       method: 'delete', //making a DELETE request
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         'deckID': deckID,
//         'cardID': cardID
//       })
//     })
//     .then(res => {
//       if (res.ok) return res.json();
//     })
//     .then(data => {
//       window.location.reload();
//     })
//   } else { //if both fields aren't populated
//     document.querySelector('#deleteMessage').innerText = "Please populate Deck ID and Card ID fields"
//   }
  
// })