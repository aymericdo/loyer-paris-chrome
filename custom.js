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
                            : (getDomain() === 'orpi') ? getIdFromOrpiUrl()
                                : (getDomain() === 'facebook') ? getIdFromFacebookUrl()
                                    : null
}

let currentDomain = getDomain()
let currentId = getIdByDomain()
let alreadyChecked = []
let currentAd = null

const fireKeywords =
    currentDomain === 'seloger' ? selogerFireKeywords()
        : currentDomain === 'leboncoin' ? leboncoinFireKeywords()
            : currentDomain === 'facebook' ? facebookFireKeywords()
                : null

const activateTab = () => {
    if (chrome.storage && currentAd) {
        chrome.storage.sync.set({ ad: { ...currentAd } })
        chrome.runtime.sendMessage({ 'message': 'activateIcon' })
    }
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
                                : currentDomain === 'orpi' ? orpiScraping()
                                    : currentDomain === 'facebook' ? facebookScraping()
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
    titleAddon.textContent = 'Annonce illégale'
    titleAddon.classList.add('title-addon')
    titleAddon.classList.add('-illegal')
    titleElements.forEach(node => {
        node.insertBefore(titleAddon.cloneNode(true), node.firstChild)
    })

    const goodPrice = document.createElement('span')
    goodPrice.textContent = currentAd.computedInfo.maxAuthorized.value + '€'
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
    const descriptionHelper = document.createElement('span')
    descriptionHelper.classList.add('-description-helper')
    descriptionHelper.classList.add(isLegal ? '-legal' : '-illegal')
    descriptionHelper.textContent = 'Cliquez sur le logo de l\'extension pour plus d\'informations ⤴'
    document.body.appendChild(descriptionHelper)

    setTimeout(() => {
        descriptionHelper.classList.add('-hide')
    }, 5000)
}

const addErrorBanner = (error) => {
    const errorBanner = document.createElement('span')
    errorBanner.classList.add('-description-helper')
    errorBanner.classList.add('-illegal')
    switch (error.error) {
        case 'paris': {
            errorBanner.textContent = 'L\'adresse de cette annonce n\'est pas dans Paris'; break;
        }
        case 'address': {
            errorBanner.textContent = 'Nous n\'avons pas trouvé d\'adresse pour cette annonce.'; break;
        }
        case 'minimal': {
            errorBanner.textContent = 'Nous n\'avons pas trouvé les informations nécessaires pour cette annonce.'; break;
        }
        default: {
            errorBanner.textContent = error.msg; break;
        }
    }
    document.body.appendChild(errorBanner)

    setTimeout(() => {
        errorBanner.classList.add('-hide')
    }, 5000)
}

const fetchDataFromJSON = (data) => {
    return { url: `${server}/${currentDomain}/data`, opts: { method: 'post', body: JSON.stringify(data) } }
}

const fetchDataFromId = (id) => {
    return { url: `${server}/${currentDomain}?id=${id}` }
}

const fetchData = () => {
    let request = null
    let requestBis = null
    if (currentDomain === 'leboncoin') {
        const data = getDataFromLeboncoinDOM()
        if (data) {
            request = fetchDataFromJSON(data)
        }
    } else if (currentDomain === 'seloger') {
        // const id = getIdFromSelogerUrl()
        // request = fetchDataFromId(id)
        const data = getDataFromSelogerDOM()
        if (data) {
            request = fetchDataFromJSON(data)
        }
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
    } else if (currentDomain === 'orpi') {
        const data = getDataFromOrpiDOM()
        if (data) {
            request = fetchDataFromJSON(data)
        }
    } else if (currentDomain === 'facebook') {
        const data = getDataFromFacebookDOM()
        if (data) {
            request = fetchDataFromJSON(data)
        }
    }

    if (request) {
        requestResolver(request, (err) => {
            if (requestBis && err.error === 'api') {
                requestResolver(requestBis, addErrorBanner.bind(err))
            } else {
                addErrorBanner(err)
            }
        })
    }
}

const requestResolver = (request, catchCallback) => {
    const fetched = fetch(request.url, request.opts)
    fetched
        .then(middlewareJson)
        .then(middlewareErrorCatcher)
        .then(handleSuccess)
        .catch(catchCallback)
}

const handleSuccess = (myJson) => {
    currentAd = { ...myJson }
    alreadyChecked.push({ domain: currentDomain, id: currentId, ad: { ...currentAd } })
    customizeTab()
}

let isFetched = false
chrome.extension.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === 'tabHasChanged') {
        activateTab()
    } else if (request.message === 'urlHasChanged') {
        const newDomain = getDomain()
        const newId = getIdByDomain()
        if (newId === null) {
            deactivateTab()
            observer.disconnect()
        } else if (!alreadyChecked.some(({ domain, id }) => domain === newDomain && id === newId)) {
            currentDomain = newDomain
            currentId = newId
            isFetched = false
            letsObserve()
        } else if (newDomain === 'facebook') {
            const ad = alreadyChecked.find(({ domain, id }) => domain === newDomain && id === newId)
            currentDomain = newDomain
            currentId = newId
            currentAd = ad.ad
            activateTab()
        }
    }
})

let timer
const observer = new MutationObserver((mutations, observer) => {
    if (timer) clearTimeout(timer)
    mutations.forEach((mutation) => {
        if (!mutation.addedNodes) return

        for (let i = 0; i < mutation.addedNodes.length; i++) {
            const node = mutation.addedNodes[i]

            if (!isFetched && node.classList && fireKeywords.includes(node.classList[0])) {
                fetchData()
                isFetched = true
                observer.disconnect()
            }
        }
    })

    timer = setTimeout(() => {
        if (!isFetched) {
            fetchData()
            isFetched = true
            observer.disconnect()
        }
    }, 3000)
})

const letsObserve = () => {
    if (fireKeywords === null) {
        fetchData()
        observer.disconnect()
    } else {
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: false,
            characterData: false
        })
    }
}

if (currentId) {
    letsObserve()
} else {
    observer.disconnect()
}
