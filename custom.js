const priceElement = document.getElementById('price');
const url = window.location.toString()
const title = document.querySelector('.detail-title.title1');

chrome.storage.sync.set({ url })
chrome.storage.sync.get('url', (data) => {
    if (data.url) {
        chrome.storage.sync.set({ id: data.url.split('/')[8].split('.')[0] })
    }
});

chrome.storage.sync.get('id', (data) => {
    fetch(`https://encadrement-loyers.herokuapp.com/seloger?id=${data.id}`)
        .then(response => response.json())
        .then((myJson) => {
            if (!myJson.isLegal) {
                title.textContent = title.textContent + '- '
                const titleAddon = document.createElement('span')
                titleAddon.textContent = '[ANNONCE ILLEGALE]'
                titleAddon.classList.add('new-title-addon')
                title.appendChild(titleAddon)

                const oldPriceElements = [...priceElement.childNodes]
                const badPrice = document.createElement('div')
                const goodPrice = document.createElement('span')
                for (var i = 0; i < oldPriceElements.length; i++) {
                    badPrice.appendChild(oldPriceElements[i])
                }
                goodPrice.textContent = myJson.maxAuthorized + '€'
                badPrice.classList.add('bad-price')
                goodPrice.classList.add('good-price')
                priceElement.appendChild(badPrice)
                priceElement.appendChild(goodPrice)
            }
            console.log(myJson)
        });
});
