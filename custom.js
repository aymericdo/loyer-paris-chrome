let currentAd = null;

const getIdFromSeLogerUrl = () => {
    const url = window.location.toString()
    const urlArray = url.split('/')
    return urlArray[urlArray.length - 1].split('.')[0]
}

const getIdFromLeBonCoinUrl = () => {
    const url = window.location.toString()
    const urlArray = url.split('/')
    return urlArray[urlArray.length - 2].split('.')[0]
}

const getIdFromLouerAgileUrl = () => {
    const url = window.location.toString()
    const urlArray = url.split('/')
    const paramArray = urlArray[urlArray.length - 1].split('?')[1].split('&')
    const ad = paramArray.find(param => param.startsWith('ad='))
    return ad ? ad.split('=')[1] : null
}

const activateTab = () => {
    chrome.runtime.sendMessage({ 'message': 'activateIcon' });
    chrome.storage.sync.set({ ad: currentAd })
}

const getDomain = () => {
    const url = window.location.toString()
    return url.split('/')[2].split('.')[1]
}

const customizeSeLoger = () => {
    const priceElement = document.getElementById('price');
    const title = document.querySelector('.detail-title.title1');

    if (!currentAd.isLegal) {
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
        goodPrice.textContent = currentAd.computedInfo.maxAuthorized + '€'
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
}

const customizeLeBonCoin = () => {
}

const customizeLouerAgile = () => {
}

const fetchData = () => {
    const id =
        getDomain() === 'seloger' ?
            getIdFromSeLogerUrl()
            : getDomain() === 'leboncoin' ?
                getIdFromLeBonCoinUrl()
                : getDomain() === 'loueragile' ?
                    getIdFromLouerAgileUrl()
                    : null

    console.log(getDomain())
    console.log(id)

    fetch(`https://encadrement-loyers.herokuapp.com/${getDomain()}?id=${id}`)
        .then(response => response.json())
        .then((myJson) => {
            currentAd = myJson
            activateTab()
            switch (getDomain()) {
                case 'seloger': {
                    customizeSeLoger(); break;
                }
                case 'leboncoin': {
                    customizeLeBonCoin(); break;
                }
                case 'loueragile': {
                    customizeLouerAgile(); break;
                }
            }
        });
}

chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.message === 'urlHasChanged') {
        if (currentAd) {
            activateTab()
        }
    }
});

fetchData()
