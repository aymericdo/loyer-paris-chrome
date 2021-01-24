document.addEventListener("DOMContentLoaded", () => {
    const detectedInfo = document.getElementById('detected-info')
    const computedInfo = document.getElementById('computed-info')

    const token = {
        address: ['Adresse'],
        charges: ['Charges', '€'],
        hasCharges: ['Charges comprises'],
        hasFurniture: ['Est meublé'],
        price: ['Prix', '€'],
        roomCount: ['Nombre de pièces'],
        surface: ['Surface', 'm²'],
        yearBuilt: ['Année de construction'],
        dateRange: ['Année de construction'],
        neighborhood: ['Quartier'],
        max: ['Prix maximum au mètre carré', '€'],
        min: ['Prix minimum au mètre carré', '€'],
        maxAuthorized: ['Prix maximum autorisé (hors charges)', '€'],
        promoPercentage: ['Promo', '%'],
        isLegal: ['Est legal'],
        true: 'Oui',
        false: 'Non',
    }

    const createList = (ulElement, data) => {
        Object.keys(data).sort((a, b) => data[a].order - data[b].order)
            .forEach(infoKey => {
                if (data[infoKey] && (data[infoKey].value || data[infoKey].value === false)) {
                    const li = document.createElement('li')
                    const spanKey = document.createElement('span')
                    const spanValue = document.createElement('span')
                    const value = typeof data[infoKey].value === 'boolean' ? token[data[infoKey].value] : data[infoKey].value
                    spanKey.textContent = token[infoKey][0]
                    spanKey.classList.add('key')
                    spanValue.textContent = token[infoKey][0] === 'Adresse' ?
                        `${value.charAt(0).toUpperCase() + value.slice(1)}`
                    :
                        `${value}${token[infoKey][1] ? token[infoKey][1] : ''}`
                    spanValue.classList.add('value')
                    li.appendChild(spanKey)
                    li.appendChild(spanValue)
                    ulElement.appendChild(li)
                }
            })
    }

    chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
            if (request.message === "sendingAd") {
                createList(detectedInfo, request.ad.detectedInfo)
                createList(computedInfo, {
                    ...request.ad.computedInfo,
                    isLegal: { order: Object.keys(request.ad.computedInfo).length, value: request.ad.isLegal },
                })
            }
        }
    );
})

chrome.runtime.sendMessage({ message: 'openingPopup' })
