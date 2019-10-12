const getIdFromLefigaroUrl = () => {
    const url = window.location.toString()
    const match = url.match(/(?<=annonces\/annonce-).*(?=.html)/g)
    return match ? match[0] : null
}

const lefigaroScraping = () => {
    const titles = [...document.querySelectorAll('#contenu > .container-h1 > h1')]
    const prices = [...document.querySelectorAll('div.container-price > span.price')]

    return [titles, prices]
}

const getDataFromLefigaroDOM = () => {
    const title = document.querySelector('#contenu > .container-h1 > h1')
    const description = document.querySelector('div.container-paragraph > p.description')
    const price = document.querySelector('div.container-price span.price')
    const cityLabel = document.querySelector('#contenu > .container-h1 > h1 > .informations-localisation')

    const features = [...document.querySelectorAll('div.container-features > ul.list-features > li')]

    let furnished = null
    let surface = null
    let rooms = null

    features.forEach(feature => {
        if (feature.textContent.match(/m²/g)) {
            surface = feature
        } else if (feature.textContent.match(/pièce/g)) {
            rooms = feature
        } else if (feature.textContent.match(/Meublé/g)) {
            furnished = feature
        }
    })

    if (!title) {
        return null
    }

    return {
        id: getIdFromLefigaroUrl(),
        title: title && title.textContent,
        description: description && description.textContent,
        price: price && price.textContent,
        rooms: rooms && rooms.textContent,
        furnished: furnished && furnished.textContent,
        surface: surface && surface.textContent,
        cityLabel: cityLabel && cityLabel.textContent,
    }
}
