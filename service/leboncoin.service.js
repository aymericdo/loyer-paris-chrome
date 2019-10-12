const getIdFromLeboncoinUrl = () => {
    const url = window.location.toString()
    const match = url.match(/\d+(?=.htm)/g)
    return match ? match[0] : null
}

const leboncoinScraping = () => {
    const titles = [...document.querySelectorAll('[data-qa-id=adview_title] h1, [data-qa-id=adview_title] h3')]
    const prices = [...document.querySelectorAll('[data-qa-id=adview_price]')].map(node => node.firstChild)

    return [titles, prices]
}

const getDataFromLeboncoinDOM = () => {
    const subject = document.querySelector('[data-qa-id=adview_title] > h1')
    const body = document.querySelector('[data-qa-id=adview_description_container] > div > span')
    const price = document.querySelector('[data-qa-id=adview_price] > div > span')
    const surface = document.querySelector('[data-qa-id=criteria_item_square] > div > div:last-child')
    const rooms = document.querySelector('[data-qa-id=criteria_item_rooms] > div > div:last-child')
    const furnished = document.querySelector('[data-qa-id=criteria_item_furnished] > div > div:last-child')
    const cityLabel = document.querySelector('[data-qa-id=adview_location_informations] > span')

    if (!subject) {
        return null
    }

    return {
        id: getIdFromLeboncoinUrl(),
        subject: subject && subject.textContent,
        body: body && body.textContent,
        price: price && price.textContent,
        rooms: rooms && rooms.textContent,
        furnished: furnished && furnished.textContent,
        surface: surface && surface.textContent,
        cityLabel: cityLabel && cityLabel.textContent,
    }
}
