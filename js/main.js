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

  fetch(url)
    .then(res => res.json()) //parse response as JSON
    .then(data => {
      // Store all found cards with CMC 10+ into resultArray
      if (cmcSelection === '10+') {
        resultArray = data.cards.filter(card => card.cmc >= 10) 
      } else {
        // Store all found cards with images and selected CMC into resultArray
        cmcSelection
          ? resultArray = data.cards.filter(card => card.cmc == cmcSelection)
          : resultArray = data.cards;
      }

      console.log(inputSearch);
      console.log(resultArray);

      resultArray.forEach(card => {
        const img = document.createElement('img'); //create image element to add to DOM
        img.src = card.imageUrl; //set img's src to the current card's imageUrl
        document.querySelector('#cardImages').appendChild(img); //add the card image to the DOM
        resultCount++; //increment count of results for each valid card found
      })
      // Put amount of results into the DOM
      document.getElementById('numberOfResults').innerText = `${resultCount} results found`;

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