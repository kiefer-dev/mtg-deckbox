document.getElementById('buttonCardSearch').addEventListener('click', getCard);

// const mtg = require('mtgsdk');

function getCard() {
  const cardNameInput = document.getElementById('inputCardName').value.split(" ").join("%20");
  const url = `https://api.magicthegathering.io/v1/cards?name=${cardNameInput}`

  fetch(url)
    .then(res => res.json()) //parse response as JSON
    .then(data => {
      console.log(cardNameInput);
      console.log(data);

      document.querySelector('#cardImages').innerHTML = '';

      data.cards.forEach(obj => {
        if (obj.imageUrl) {
          const img = document.createElement('img');
          img.src = obj.imageUrl;
          document.querySelector('div').appendChild(img);
        }
      })




    })
}