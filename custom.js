const priceElement = document.getElementById('price');
const title = document.querySelector('.detail-title.title1');
const hashAd = {};

const getIdFromUrl = () => {
    const url = window.location.toString()
    const urlArray = url.split('/')
    return urlArray[urlArray.length - 1].split('.')[0]
}

chrome.runtime.sendMessage({ 'message': 'activateIcon' });
chrome.storage.sync.set({ id: getIdFromUrl() })

chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.message === 'urlHasChanged') {
        chrome.runtime.sendMessage({ 'message': 'activateIcon' });
        if (hashAd.hasOwnProperty(getIdFromUrl())) {
            chrome.storage.sync.set({ ad: hashAd[getIdFromUrl()] })
        }
    }
});

chrome.storage.sync.get('id', (data) => {
    fetch(`https://encadrement-loyers.herokuapp.com/seloger?id=${data.id}`)
        .then(response => response.json())
        .then((myJson) => {
            hashAd[data.id] = myJson
            chrome.storage.sync.set({ ad: myJson })
            if (!myJson.isLegal) {
                const titleAddon = document.createElement('span')
                titleAddon.textContent = 'ANNONCE ILLEGALE'
                titleAddon.classList.add('title-addon')
                titleAddon.classList.add('-illegal')
                title.appendChild(titleAddon)

                const subTitleAddon = document.createElement('span')
                subTitleAddon.classList.add('title-addon')
                subTitleAddon.textContent = '(Cliquez sur le logo de l\'extension (à droite de l\'url) pour plus d\'informations)'
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
