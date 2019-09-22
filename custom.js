const priceElement = document.getElementById('price');
const url = window.location.toString()
const id = url.split('/')[8].split('.')[0]
const title = document.querySelector('.detail-title.title1');

chrome.storage.sync.set({ id })
chrome.storage.sync.get('id', (data) => {
    fetch(`https://encadrement-loyers.herokuapp.com/seloger?id=${data.id}`)
        .then(response => response.json())
        .then((myJson) => {
            chrome.storage.sync.set({ ad: myJson })
            if (!myJson.isLegal) {
                const titleAddon = document.createElement('span')
                titleAddon.textContent = 'ANNONCE ILLEGALE'
                titleAddon.classList.add('title-addon')
                titleAddon.classList.add('-illegal')
                title.appendChild(titleAddon)

                const subTitleAddon = document.createElement('span')
                subTitleAddon.classList.add('title-addon')
                subTitleAddon.textContent = '(Cliquez sur l\'extension pour plus d\'informations)'
                title.appendChild(subTitleAddon)

                const oldPriceElements = [...priceElement.childNodes]
                const badPrice = document.createElement('div')
                const goodPrice = document.createElement('span')
                for (var i = 0; i < oldPriceElements.length; i++) {
                    badPrice.appendChild(oldPriceElements[i])
                }
                goodPrice.textContent = myJson.computedInfo.maxAuthorized + '€'
                badPrice.classList.add('bad-price')
                goodPrice.classList.add('good-price')
                priceElement.appendChild(badPrice)
                priceElement.appendChild(goodPrice)
            } else {
                const titleAddon = document.createElement('span')
                titleAddon.textContent = '✓'
                titleAddon.classList.add('title-addon')
                titleAddon.classList.add('-legal')
                title.appendChild(titleAddon)
            }
        });
});
