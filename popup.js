const detectedInfo = document.getElementById('detected-info');
const computedInfo = document.getElementById('computed-info');

const token = {
    address: ['Adresse'],
    hasFurniture: ['Est meublé'],
    price: ['Prix', '€'],
    roomCount: ['Nombre de pièces'],
    surface: ['Surface', 'm²'],
    yearBuilt: ['Année de construction'],
    dateRange: ['Année de construction'],
    neighborhood: ['Quartier'],
    max: ['Prix maximum au mètre carré', '€'],
    min: ['Prix minimum au mètre carré', '€'],
    maxAuthorized: ['Prix maximum autorisé par défaut', '€'],
    true: 'Oui',
    false: 'Non',
}

const createList = (ulElement, data) => {
    Object.keys(data).forEach(infoKey => {
        if (data[infoKey]) {
            const li = document.createElement('li')
            const value = typeof data[infoKey] === 'boolean' ? token[data[infoKey]] : data[infoKey]
            li.textContent = `${token[infoKey][0]} -> ${value}${token[infoKey][1] ? token[infoKey][1] : ''}`
            ulElement.appendChild(li)
        }
    })
}

chrome.storage.sync.get('ad', (data) => {
    createList(detectedInfo, data.ad.detectedInfo)
    createList(computedInfo, data.ad.computedInfo)
});
