const getIdFromLeboncoinUrl = () => {
    const url = window.location.toString()
    const match = url.match(/(?<=\/locations\/)\d+(?=.htm)/g) || url.match(/(?<=\/vi\/)\d+(?=.htm)/g)
    return match ? match[0] : null
}

const leboncoinFireKeywords = () => ['myDvm']

const leboncoinScraping = () => {
    const titles = [document.querySelector('h1[data-qa-id=adview_title]'), document.querySelector('div[data-qa-id=adview_title] > div.styles_subject__3AeTh > p')]
    const prices = [...document.querySelectorAll('[data-qa-id=adview_price] > span')]

    return [titles, prices]
}

const getDataFromLeboncoinDOM = () => {
    const subject = document.querySelector('[data-qa-id=adview_title]')
    const body = document.querySelector('[data-qa-id=adview_description_container] > div > span')
    const price = document.querySelector('[data-qa-id=adview_price] > span')
    const renter = document.querySelector("#aside > section > div[data-qa-id=adview_contact_container] > div > div > div")
    const isPro = document.querySelector("#aside > section > div[data-qa-id=adview_contact_container] > div > span")
    
    const surface = document.querySelector("#grid > article > div:nth-child(3) > div > div > div[data-qa-id=criteria_item_square] > div > p._3eNLO._137P-.P4PEa._35DXM")
    const rooms = document.querySelector("#grid > article > div:nth-child(3) > div > div > div[data-qa-id=criteria_item_rooms] > div > p._3eNLO._137P-.P4PEa._35DXM")
    const furnished = document.querySelector("#grid > article > div:nth-child(3) > div > div > div[data-qa-id=criteria_item_furnished] > div > p._3eNLO._137P-.P4PEa._35DXM")
    const hasCharges = document.querySelector("#grid > article > section > div.css-1eifrgn > div.css-rtde4j > div > div._2KqHw > p")
    const cityLabel = document.querySelector("#grid > article > div:nth-child(5) > h2")

    if (!subject && !body && !price && !cityLabel) {
        return null
    }

    return {
        id: getIdFromLeboncoinUrl(),
        body: body && body.innerHTML,
        hasCharges: hasCharges && hasCharges.textContent === 'Charges comprises',
        cityLabel: cityLabel && cityLabel.textContent,
        furnished: furnished && furnished.textContent,
        price: price && price.textContent,
        renter: (renter && isPro && (!!isPro.textContent.toLowerCase().includes('siren') || !!isPro.textContent.toLowerCase().includes('siret'))) ? renter.textContent : null,
        rooms: rooms && rooms.textContent,
        subject: subject && subject.textContent,
        surface: surface && surface.textContent,
    }
}
