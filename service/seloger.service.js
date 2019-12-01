const getIdFromSelogerUrl = () => {
    const url = window.location.toString()
    const match = url.match(/(?<=annonces\/locations(.)+)\d+(?=.htm)/g)
    return match ? match[0] : null
}

const selogerFireKeywords = () => ['description-bien']

const selogerScraping = () => {
    const title = document.querySelector('.detail-title.title1')
    const price = document.getElementById('price')

    return [[title], [price]]
}

const getDataFromSelogerDOM = () => {
    const title = document.querySelector('.detail-title.title1')
    const description = document.querySelector('div.description-bien > section.categorie > p')
    const price = document.getElementById('price')
    const cityLabel = document.querySelector('.resume p.localite')
    const renter = document.querySelector('.agence-title')
    const itemTags = [...document.querySelectorAll('.resume ul.criterion > li')]
    const furnishedElements = [...document.querySelectorAll('section.categorie .criteria-wrapper > div')]
    const chargesElement = document.querySelector('section.categorie.with-padding-bottom .sh-text-light')

    let surface = null
    let rooms = null
    const chargesArray = chargesElement && chargesElement.innerHTML.split('span')
    const chargesIndex = chargesArray && chargesArray.indexOf(chargesArray.find(elem => elem.search('charges') !== -1))
    const charges = chargesArray && chargesArray.length && chargesArray[chargesIndex + 1]

    const furnished = furnishedElements.some(el => {
        return el.textContent.match(/^Meublé/g)
    })

    itemTags.forEach(tag => {
        if (tag.textContent.match(/m²/g)) {
            surface = tag
        } else if (tag.textContent.match(/pièce/g)) {
            rooms = tag
        }
    })

    if (!title) {
        return null
    }

    return {
        id: getIdFromSelogerUrl(),
        cityLabel: cityLabel && cityLabel.textContent,
        charges,
        description: description && description.textContent,
        furnished,
        hasCharges: price && price.textContent.includes('CC'),
        price: price && price.textContent,
        renter: renter && renter.textContent.includes('particulier') ? null : renter.textContent,
        rooms: rooms && rooms.textContent,
        surface: surface && surface.textContent,
        title: title && title.textContent,
    }
}
