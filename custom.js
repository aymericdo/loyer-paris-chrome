let currentAd = null

const getIdFromSeLogerUrl = () => {
    const url = window.location.toString()
    return url.match(/\d+(?=.htm)/)[0]
}

const getIdFromLeBonCoinUrl = () => {
    const url = window.location.toString()
    return url.match(/\d+(?=.htm)/)[0]
}

const getIdFromLouerAgileUrl = () => {
    const url = window.location.toString()
    return url.match(/\?<=ad=)\d+/)
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
    subTitleAddon.classList.add('-description-helper')
    subTitleAddon.textContent = '(Cliquez sur le logo de l\'extension (à droite de l\'url) pour plus d\'informations)'
    titleElements.forEach(node => {
        node.appendChild(subTitleAddon.cloneNode(true))
    })

    const goodPrice = document.createElement('span')
    goodPrice.textContent = currentAd.computedInfo.maxAuthorized + '€'
    goodPrice.classList.add('good-price')

    priceElements.forEach(node => {
        const badPrice = document.createElement('div')
        badPrice.classList.add('bad-price')

        const oldPriceElements = [...node.childNodes]
        oldPriceElements.forEach(node => {
            badPrice.appendChild(node.cloneNode(true))
        })

        node.innerHTML = ''
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
    const prices = [...document.querySelectorAll('[data-qa-id=adview_price]')].map(node => node.firstChild)
    console.log(prices)

    return [titles, prices]
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
        .then((response) => {
            if (response.status === 200) {
                return response.json()
            } else {
                throw Error(response.statusText)
            }
        })
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
        }).catch((err) => {
            console.log(err)
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
