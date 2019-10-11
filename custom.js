const getDomain = () => {
    const url = window.location.toString()
    return url.split('/')[2].split('.')[1]
}

const getIdByDomain = () => {
    return (getDomain() === 'leboncoin') ? getIdFromLeboncoinUrl()
        : (getDomain() === 'seloger') ? getIdFromSelogerUrl()
            : (getDomain() === 'loueragile') ? getIdFromLoueragileUrl()
                : (getDomain() === 'pap') ? getIdFromPapUrl()
                    : (getDomain() === 'logic-immo') ? getIdFromLogicimmoUrl()
                        : (getDomain() === 'lefigaro') ? getIdFromLefigaroUrl()
                            : null
}

let currentDomain = getDomain()
let currentId = getIdByDomain()
let currentAd = null

const activateTab = () => {
    chrome.storage.sync.set({ ad: { ...currentAd } })
    chrome.runtime.sendMessage({ 'message': 'activateIcon' })
}

const deactivateTab = () => {
    currentAd = null
    currentDomain = null
    currentId = null
    chrome.runtime.sendMessage({ 'message': 'deactivateIcon' })
}

const customizeTab = () => {
    activateTab()
    const [titleElements, priceElements] =
        currentDomain === 'seloger' ? selogerScraping()
            : currentDomain === 'leboncoin' ? leboncoinScraping()
                : currentDomain === 'loueragile' ? loueragileScraping()
                    : currentDomain === 'pap' ? papScraping()
                        : currentDomain === 'logic-immo' ? logicimmoScraping()
                            : currentDomain === 'lefigaro' ? lefigaroScraping()
                                : null

    if (!currentAd.isLegal) {
        customizeIllegalAd(titleElements, priceElements)
    } else {
        customizeLegalAd(titleElements)
    }

    addDescriptionHelper(currentAd.isLegal)
}

const customizeLegalAd = (titleElements) => {
    const titleAddon = document.createElement('span')
    titleAddon.textContent = '✓'
    titleAddon.classList.add('title-addon')
    titleAddon.classList.add('-legal')
    titleAddon.classList.add(`-${currentDomain}`)
    titleElements.forEach(node => {
        node.insertBefore(titleAddon.cloneNode(true), node.firstChild)
    })
}

const customizeIllegalAd = (titleElements, priceElements) => {
    const titleAddon = document.createElement('span')
    titleAddon.textContent = 'ANNONCE ILLEGALE'
    titleAddon.classList.add('title-addon')
    titleAddon.classList.add('-illegal')
    titleElements.forEach(node => {
        node.insertBefore(titleAddon.cloneNode(true), node.firstChild)
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
    return fetch(`${server}/${currentDomain}/data`, { method: 'post', body: JSON.stringify(data) })
}

const fetchDataFromId = (id) => {
    return fetch(`${server}/${currentDomain}?id=${id}`)
}

const fetchData = () => {
    let request = null
    if (currentDomain === 'leboncoin') {
        const data = getDataFromLeboncoinDOM()
        if (data) {
            request = fetchDataFromJSON(data)
        }
    } else if (currentDomain === 'seloger') {
        const id = getIdFromSelogerUrl()
        request = fetchDataFromId(id)
    } else if (currentDomain === 'loueragile') {
        const id = getIdFromLoueragileUrl()
        request = fetchDataFromId(id)
    } else if (currentDomain === 'pap') {
        const data = getDataFromPapDOM()
        if (data) {
            request = fetchDataFromJSON(data)
        }
    } else if (currentDomain === 'logic-immo') {
        const data = getDataFromLogicimmoDOM()
        if (data) {
            request = fetchDataFromJSON(data)
        }
    } else if (currentDomain === 'lefigaro') {
        const data = getDataFromLefigaroDOM()
        if (data) {
            request = fetchDataFromJSON(data)
        }
    }

    if (request) {
        request
            .then(middleware)
            .then(handleSuccess)
            .catch(err => {
                console.log(err)
            })
    }
}

const handleSuccess = (myJson) => {
    currentAd = { ...myJson }
    customizeTab()
}

chrome.extension.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === 'tabHasChanged') {
        activateTab()
    } else if (request.message === 'urlHasChanged') {
        const newDomain = getDomain()
        const newId = getIdByDomain()
        if (newId === null) {
            deactivateTab()
        } else if (currentDomain !== newDomain || currentId !== newId) {
            currentDomain = newDomain
            currentId = newId
            fetchData()
        }
    }
})

if (currentId) {
    fetchData()
}
