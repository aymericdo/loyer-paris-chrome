const getIdFromPapUrl = () => {
    const url = window.location.toString()
    const match = url.match(/(?<=-)r\d+/g)
    return match ? match[0] : null
}

const papScraping = () => {
    const titles = [...document.querySelectorAll('h1.item-title')]
    const prices = [...document.querySelectorAll('h1.item-title > span.item-price')]

    return [titles, prices]
}

const getDataFromPapDOM = () => {
    const title = document.querySelector('h1.item-title')
    const description = document.querySelector('.item-description > div > p')
    const price = document.querySelector('h1.item-title > span.item-price')
    const cityLabel = document.querySelector('div.item-description > h2')
    const itemTags = [...document.querySelectorAll('.item-tags > li > strong')]

    let surface = null
    let rooms = null
    let furnished = null

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
        id: getIdFromPapUrl(),
        title: title && title.textContent,
        description: description && description.textContent,
        price: price && price.textContent && price.textContent.replace(/\s|\.|,/g, '').match(/\d+/g)[0],
        attributes: [{
            key: "rooms",
            value: rooms && rooms.textContent.match(/\d+/g)[0],
        }, {
            key: "furnished",
            value: furnished ? furnished && furnished.textContent === 'Meublé' ? '1' : '2' : null,
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
