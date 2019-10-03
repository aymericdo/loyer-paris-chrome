const getIdFromLeboncoinUrl = () => {
    const url = window.location.toString()
    const match = url.match(/\d+(?=.htm)/)
    return match ? match[0] : null
}

const leboncoinScraping = () => {
    const titles = [...document.querySelectorAll('[data-qa-id=adview_title] h1, [data-qa-id=adview_title] h3')]
    const prices = [...document.querySelectorAll('[data-qa-id=adview_price]')].map(node => node.firstChild)

    return [titles, prices]
}

const getDataFromDOM = () => {
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
        list_id: getIdFromLeboncoinUrl(),
        subject: subject && subject.textContent,
        body: body && body.textContent,
        price: [
            price && price.textContent && price.textContent.replace(/\s/g, '').match(/\d+/g)[0],
        ],
        attributes: [{
            key: "rooms",
            value: rooms && rooms.textContent,
            key_label: "Pièces",
            value_label: rooms && rooms.textContent,
            generic: true
        }, {
            key: "furnished",
            value: furnished && furnished.textContent === 'Meublé' ? '1' : '2',
            key_label: "Meublé / Non meublé",
            value_label: furnished && furnished.textContent,
            generic: true
        }, {
            key: "square",
            value: surface && surface.textContent && surface.textContent.match(/\d+/g)[0],
            key_label: "Surface",
            value_label: surface && surface.textContent,
            generic: true
        }],
        location: {
            cityLabel: cityLabel && cityLabel.textContent,
            city: cityLabel && cityLabel.textContent && cityLabel.textContent.match(/[A-Za-z]+/g)[0],
            zipcode: cityLabel && cityLabel.textContent && cityLabel.textContent.match(/\d+/g)[0],
        }
    }
}
