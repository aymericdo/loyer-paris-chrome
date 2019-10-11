const getIdFromLogicimmoUrl = () => {
    const url = window.location.toString()
    const match = url.match(/(?<=detail-location-).*(?=.htm)/)
    return match ? match[0] : null
}

const logicimmoScraping = () => {
    const titles = [...document.querySelectorAll('h2.offerMainFeatures')]
    const prices = [...document.querySelectorAll('div.rightSide > .price > div')]

    return [titles, prices]
}

const getDataFromLogicimmoDOM = () => {
    const title = document.querySelector('h2.offerMainFeatures > meta')
    const description = document.querySelector('div.offer-description-text > meta')
    const price = document.querySelector('div.rightSide > .price > div')
    const cityLabel = document.querySelector('[itemprop=address]')

    const offerCriteria = [...document.querySelectorAll('div.offerCriteria > ul > li.listItem')]
    const itemTags = [...document.querySelectorAll('h2.offerMainFeatures > .feature')]

    let ref = null
    let furnished = null

    offerCriteria.forEach(criteria => {
        const label = criteria.querySelector('.label')
        const value = criteria.querySelector('.value')
        if (label.textContent === 'Ref de l\'annonce') {
            ref = value
        } else if (label.textContent === 'Meublé') {
            furnished = value
        }
    })

    let surface = null
    let rooms = null

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
        id: ref,
        title: title && title.textContent,
        description: description && description.textContent,
        price: price && price.textContent && price.textContent.replace(/\s|\.|,/g, '').match(/\d+/g)[0],
        attributes: [{
            key: "rooms",
            value: rooms && rooms.textContent.match(/\d+/g)[0],
        }, {
            key: "furnished",
            value: furnished ? furnished && furnished.textContent !== 'NC' ? '1' : '2' : null,
        }, {
            key: "square",
            value: surface && surface.textContent && surface.textContent.match(/\d+/g)[0],
        }],
        location: {
            cityLabel: cityLabel && cityLabel.textContent,
            city: cityLabel && cityLabel.textContent && cityLabel.textContent.match(/[A-Za-z]+/g)[0],
            zipcode: cityLabel && cityLabel.textContent && cityLabel.textContent.match(/\b75[0-9]{3}\b/g)[0],
        }
    }
}
