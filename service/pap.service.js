const getIdFromPapUrl = () => {
    const url = window.location.toString()
    const match = url.match(/(?<=annonce\/locations\-appartement(.)+)(?<=-)r\d+/g)
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
        price: price && price.textContent,
        rooms: rooms && rooms.textContent,
        furnished: furnished && furnished.textContent,
        surface: surface && surface.textContent,
        cityLabel: cityLabel && cityLabel.textContent,
    }
}
