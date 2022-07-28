// Click event on button to search for cards
document.getElementById('buttonCardSearch').addEventListener('click', getCard);

function getCard() {
  // Take whether the search term is for card name or card subtype
  const nameOrSubtype = document.getElementById('selectNameOrSubtype').value;
  // Take the input search term and sanitize it for API use
  const inputSearch = document.getElementById('inputCardSearch').value.split(" ").join("%20");
  // Create the fetch url
  const url = `https://api.magicthegathering.io/v1/cards?${nameOrSubtype}=${inputSearch}`;
  // Clear the results list on button click
  document.querySelector('#cardImages').innerHTML = '';

  fetch(url)
    .then(res => res.json()) //parse response as JSON
    .then(data => {
      console.log(inputSearch);
      console.log(data);

      

      data.cards.forEach(obj => {
        if (obj.imageUrl) {
          const img = document.createElement('img');
          img.src = obj.imageUrl;
          document.querySelector('#cardImages').appendChild(img);
        }
      })




    })
}