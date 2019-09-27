let currentAd = null

const activateTab = () => {
    chrome.runtime.sendMessage({ 'message': 'activateIcon' })
    chrome.storage.sync.set({ ad: { ...currentAd } })
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

const addDescriptionHelper = (isLegal) => {
    const subTitleAddon = document.createElement('span')
    subTitleAddon.classList.add('title-addon')
    subTitleAddon.classList.add('-description-helper')
    subTitleAddon.classList.add(isLegal ? '-legal' : '-illegal')
    subTitleAddon.textContent = 'Cliquez sur le logo de l\'extension pour plus d\'informations ⤴'
    document.body.appendChild(subTitleAddon)

    setTimeout(() => {
        subTitleAddon.classList.add('-hide')
    }, 5000)
}

const fetchDataFromJSON = (data) => {
    return fetch(`${server}/${getDomain()}/data`, { method: 'post', body: JSON.stringify(data) })
}

const fetchDataFromId = (id) => {
    return fetch(`${server}/${getDomain()}?id=${id}`)
}

const fetchData = () => {
    let request = null
    if (getDomain() === 'leboncoin') {
        const data = getDataFromLeboncoinScriptInDOM()
        request = fetchDataFromJSON(data)
    } else if (getDomain() === 'seloger') {
        const id = getIdFromSelogerUrl()
        request = fetchDataFromId(id)
    } else if (getDomain() === 'loueragile') {
        const id = getIdFromLoueragileUrl()
        request = fetchDataFromId(id)
    }

    request
        .then(middleware)
        .then(handleSuccess)
        .catch(err => console.log(err))
}

const handleSuccess = (myJson) => {
    currentAd = { ...myJson }
    activateTab()

    const [titleElements, priceElements] =
        getDomain() === 'seloger' ? selogerScraping()
            : getDomain() === 'leboncoin' ? leboncoinScraping()
                : getDomain() === 'loueragile' ? loueragileScraping()
                    : null

    if (!currentAd.isLegal) {
        customizeIllegalAd(titleElements, priceElements)
    } else {
        customizeLegalAd(titleElements)
    }

    addDescriptionHelper(currentAd.isLegal)
}

chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.message === 'urlHasChanged') {
        if (currentAd) {
            activateTab()
        } else {
            fetchData()
        }
    }
})

fetchData()
