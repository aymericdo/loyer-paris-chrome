const getDomain = () => {
    const url = window.location.toString()
    return url.split('/')[2].split('.')[1]
}

const getIdByDomain = () => {
    return (getDomain() === 'leboncoin') ?
        getIdFromLeboncoinUrl()
    : (getDomain() === 'seloger') ?
        getIdFromSelogerUrl()
    : (getDomain() === 'jinka') ?
        getIdFromLoueragileUrl()
    : (getDomain() === 'pap') ?
        getIdFromPapUrl()
    : (getDomain() === 'logic-immo') ?
        getIdFromLogicimmoUrl()
    : (getDomain() === 'lefigaro') ?
        getIdFromLefigaroUrl()
    : (getDomain() === 'orpi') ?
        getIdFromOrpiUrl()
    : (getDomain() === 'facebook') ?
        getIdFromFacebookUrl()
    :
        null
}

let currentDomain = getDomain()
let currentId = getIdByDomain()
let alreadyChecked = []
let currentAd = null

const fireKeywords = currentDomain === 'seloger' ?
    selogerFireKeywords()
: currentDomain === 'leboncoin' ?
    leboncoinFireKeywords()
: currentDomain === 'facebook' ?
    facebookFireKeywords()
: currentDomain === 'jinka' ?
    loueragileFireKeywords()
:
    null

const activateTab = () => {
    if (currentAd) {
        chrome.runtime.sendMessage({ message: 'activateIcon', ad: { ...currentAd } })
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
    const [titleElements, priceElements] = currentDomain === 'seloger' ?
        selogerScraping()
    : currentDomain === 'leboncoin' ?
        leboncoinScraping()
    : currentDomain === 'jinka' ?
        loueragileScraping()
    : currentDomain === 'pap' ?
        papScraping()
    : currentDomain === 'logic-immo' ?
        logicimmoScraping()
    : currentDomain === 'lefigaro' ?
        lefigaroScraping()
    : currentDomain === 'orpi' ?
        orpiScraping()
    : currentDomain === 'facebook' ?
        facebookScraping()
    :
        null

    if (!currentAd.isLegal) {
        customizeIllegalAd(titleElements, priceElements)
    } else {
        customizeLegalAd(titleElements)
    }

    addDescriptionHelper("Cliquez sur le logo de l'extension pour plus d'informations ⤴", currentAd.isLegal)
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

const addErrorBanner = (error) => {
    switch (error.error) {
        case 'city': {
            addDescriptionHelper("L'adresse de cette annonce n'est pas dans Paris.", false); break;
        }
        case 'address': {
            addDescriptionHelper("Nous n'avons pas trouvé d'adresse pour cette annonce.", false); break;
        }
        case 'minimal': {
            addDescriptionHelper("Nous n'avons pas trouvé les informations nécessaires pour cette annonce.", false); break;
        }
        case 'price': {
            addDescriptionHelper("Le prix de l'annonce semble être incohérent.", false); break;
        }
        case 'partner': {
            addDescriptionHelper("Nous avons rencontré un problème de communication interne.", false); break;
        }
        case 'filter': {
            addDescriptionHelper("Nous avons pas trouvé de correspondance.", false); break;
        }
        case 'outdated': {
            addDescriptionHelper("L'extension n'est plus à jour. Vous pouvez la mettre à jour manuellement dans les réglages.", false); break;
        }
        default: {
            addDescriptionHelper(error.msg, false); break;
        }
    }
}

let cpt = 0
const addDescriptionHelper = (text, isLegal) => {
    const descriptionHelper = document.createElement('span')
    descriptionHelper.classList.add('-description-helper')
    descriptionHelper.classList.add(isLegal ? '-legal' : '-illegal')
    descriptionHelper.textContent = text
    document.body.appendChild(descriptionHelper)

    if (cpt > 0) {
        descriptionHelper.style.top = `${(56 * cpt) + (14 * 2)}px`
    }

    cpt += 1

    setTimeout(() => {
        descriptionHelper.classList.add('-hide')
        cpt -= 1
    }, 5000)
}

const fetchDataFromJSON = (data) => {
    return { url: `${server}/${currentDomain}/data`, opts: { method: 'post', body: JSON.stringify(data) } }
}

const fetchDataFromId = (id) => {
    return { url: `${server}/${currentDomain}?id=${id}` }
}

const isExtensionUpToDate = (version) => {
    return { url: `${server}/version?version=${version}` }
}

const checkExtensionVersion = () => {
    const manifestData = chrome.runtime.getManifest()
    const request = isExtensionUpToDate(manifestData.version)
    fetch(request.url)
        .then(middlewareJson)
        .then(middlewareErrorCatcher)
        .then((isOutdated) => {
            if (isOutdated) {
                addErrorBanner({ error: 'outdated' })
            }
        })
}

const fetchData = () => {
    let request = null
    checkExtensionVersion()
    if (currentDomain === 'leboncoin') {
        const data = getDataFromLeboncoinDOM()
        if (data) {
            request = fetchDataFromJSON(data)
        } else {
            request = fetchDataFromJSON({ noMoreData: true })
        }
    } else if (currentDomain === 'seloger') {
        const data = getDataFromSelogerDOM()
        if (data) {
            request = fetchDataFromJSON(data)
        } else {
            request = fetchDataFromJSON({ noMoreData: true })
        }
    } else if (currentDomain === 'jinka') {
        const id = getIdFromLoueragileUrl()
        request = fetchDataFromId(id)
    } else if (currentDomain === 'pap') {
        const data = getDataFromPapDOM()
        if (data) {
            request = fetchDataFromJSON(data)
        } else {
            request = fetchDataFromJSON({ noMoreData: true })
        }
    } else if (currentDomain === 'logic-immo') {
        const data = getDataFromLogicimmoDOM()
        if (data) {
            request = fetchDataFromJSON(data)
        } else {
            request = fetchDataFromJSON({ noMoreData: true })
        }
    } else if (currentDomain === 'lefigaro') {
        const data = getDataFromLefigaroDOM()
        if (data) {
            request = fetchDataFromJSON(data)
        } else {
            request = fetchDataFromJSON({ noMoreData: true })
        }
    } else if (currentDomain === 'orpi') {
        const data = getDataFromOrpiDOM()
        if (data) {
            request = fetchDataFromJSON(data)
        } else {
            request = fetchDataFromJSON({ noMoreData: true })
        }
    } else if (currentDomain === 'facebook') {
        const data = getDataFromFacebookDOM()
        if (data) {
            request = fetchDataFromJSON(data)
        }
    }

    if (request) {
        requestResolver(request, (err) => {
            addErrorBanner(err)
        })
    }
}

const requestResolver = (request, catchCallback) => {
    alreadyChecked.push({ domain: currentDomain, id: currentId, ad: { ...currentAd } })
    const fetched = fetch(request.url, request.opts)
    fetched
        .then(middlewareJson)
        .then(middlewareErrorCatcher)
        .then(handleSuccess)
        .catch(catchCallback)
}

const handleSuccess = (myJson) => {
    currentAd = { ...myJson }
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
