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
  const url = `https://api.magicthegathering.io/v1/cards?${nameOrSubtype}=${inputSearch}&contains=imageUrl`;

  // Store the Converted Mana Cost selection
  const cmcSelection = document.getElementById('selectCMC').value;

  // Clear the results list on button click
  document.querySelector('#cardImages').innerHTML = '';

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

      console.log(inputSearch);
      console.log(resultArray);

      resultArray.forEach(card => {
        // Create image element to add to DOM
        const img = document.createElement('img'); 

        // Set img's src to the current card's imageUrl
        img.src = card.imageUrl; 

        // Add the card image to the DOM in the #cardImages section
        document.querySelector('#cardImages').appendChild(img); 

        // Increment count of results for each valid card found
        resultCount++; 
      })

      // Put result count into the DOM in #numberOfResults
      resultCount >= 100
        ? document.getElementById('numberOfResults').innerText = "100+ results found, please be more specific!"
        : document.getElementById('numberOfResults').innerText = `${resultCount} results found`;
      

    })
}



function filter() {
  const cmcSelection = document.getElementById('selectCMC').value;
  let resultArrayFiltered;

  if (cmcSelection === '10+') {
    resultArrayFiltered = resultArray.filter(card => card.cmc >= 10);
  } else {
    resultArrayFiltered = resultArray.filter(card => card.cmc == cmcSelection)
  }
  
  console.log(resultArrayFiltered)
}
