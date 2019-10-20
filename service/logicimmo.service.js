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
    const title = document.querySelector('h2.offerMainFeatures')
    const description = document.querySelector('div.offer-description-text')
    const price = document.querySelector('div.rightSide > .price > div')
    const cityLabel = document.querySelector('[itemprop=address]')
    const renter = document.querySelector('div.agencyInfos div.agencyNameNoLogo')

    const offerCriteria = [...document.querySelectorAll('div.offerCriteria > ul > li.listItem')]
    const itemTags = [...document.querySelectorAll('h2.offerMainFeatures > .feature')]

    let ref = null
    let furnished = null

    offerCriteria.forEach(criteria => {
        const label = criteria.querySelector('.label')
        const value = criteria.querySelector('.value').cloneNode(true)
        if (value && value.firstChild) {
            value.removeChild(value.firstChild)
        }
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
        id: ref && ref.textContent,
        cityLabel: cityLabel && cityLabel.textContent,
        description: description && description.textContent,
        furnished: furnished && furnished.textContent,
        price: price && price.textContent,
        renter: renter && renter.textContent,
        rooms: rooms && rooms.textContent,
        surface: surface && surface.textContent,
        title: title && title.textContent,
    }
}
