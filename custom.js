let currentAd = null

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
    chrome.runtime.sendMessage({ 'message': 'activateIcon' })
    chrome.storage.sync.set({ ad: currentAd })
}

const getDomain = () => {
    const url = window.location.toString()
    return url.split('/')[2].split('.')[1]
}

const customizeLegalAd = (titleElements) => {
    const titleAddon = document.createElement('span')
    titleAddon.textContent = '✓'
    titleAddon.classList.add('title-addon')
    titleAddon.classList.add('-legal')
    titleAddon.classList.add(`-${getDomain()}`)
    titleElements.forEach(node => {
        node.appendChild(titleAddon.cloneNode(true))
    })
}

const customizeIllegalAd = (titleElements, priceElements) => {
    const titleAddon = document.createElement('span')
    titleAddon.textContent = 'ANNONCE ILLEGALE'
    titleAddon.classList.add('title-addon')
    titleAddon.classList.add('-illegal')
    titleElements.forEach(node => {
        node.appendChild(titleAddon.cloneNode(true))
    })

    const subTitleAddon = document.createElement('span')
    subTitleAddon.classList.add('title-addon')
    subTitleAddon.textContent = '(Cliquez sur le logo de l\'extension (à droite de l\'url) pour plus d\'informations)'
    titleElements.forEach(node => {
        node.appendChild(subTitleAddon.cloneNode(true))
    })

    const oldPriceElements = [...priceElement.childNodes]
    const badPrice = document.createElement('div')
    const goodPrice = document.createElement('span')
    for (var i = 0; i < oldPriceElements.length; i++) {
        badPrice.appendChild(oldPriceElements[i])
    }
    goodPrice.textContent = currentAd.computedInfo.maxAuthorized + '€'
    badPrice.classList.add('bad-price')
    goodPrice.classList.add('good-price')
    priceElements.forEach(node => {
        node.appendChild(badPrice.cloneNode(true))
        node.appendChild(goodPrice.cloneNode(true))
    })
}

const seLogerScraping = () => {
    const title = document.querySelector('.detail-title.title1')
    const price = document.getElementById('price')

    return [[title], [price]]
}

const leBonCoinScraping = () => {
    const titles = [...document.querySelectorAll('[data-qa-id=adview_title] h1, [data-qa-id=adview_title] h3')]
    const price = document.querySelector('[data-qa-id=adview_price]').firstChild

    return [titles, [price]]
}

const louerAgileScraping = () => {
    return []
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

    fetch(`https://encadrement-loyers.herokuapp.com/${getDomain()}?id=${id}`)
        .then(response => response.json())
        .then((myJson) => {
            currentAd = myJson
            activateTab()

            const [titleElements, priceElements] =
                getDomain() === 'seloger' ?
                    seLogerScraping()
                    : getDomain() === 'leboncoin' ?
                        leBonCoinScraping()
                        : getDomain() === 'loueragile' ?
                            louerAgileScraping()
                            : null

            if (!currentAd.isLegal) {
                customizeIllegalAd(titleElements, priceElements)
            } else {
                customizeLegalAd(titleElements)
            }
        })
}

chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.message === 'urlHasChanged') {
        if (currentAd) {
            activateTab()
        }
    }
})

fetchData()
