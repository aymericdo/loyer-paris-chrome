const getIdFromFacebookUrl = () => {
    const url = window.location.toString()
    const match = url.match(/(?<=marketplace\/item\/)\d+/g)
    return match ? match[0] : null
}

const facebookFireKeywords = () => ['fbChatSidebarMessage', '_4l8h']

const facebookScraping = () => {
    const ads = [...document.querySelectorAll('[data-testid=marketplace_pdp_component]')]
    const ad = (ads.length > 1) ? ads[1] : ads[0]

    const titles = [ad.querySelector('[data-testid=marketplace_pdp_title]')]
    const prices = [ad.querySelector('._ohe ._5_md._2iel')]

    return [titles, prices]
}

const getDataFromFacebookDOM = () => {
    const ads = [...document.querySelectorAll('[data-testid=marketplace_pdp_component]')]
    const ad = (ads.length > 1) ? ads[1] : ads[0]

    const sectionTitleElem = ad.querySelector('a._31_d > div._7n1d._4ik4._4ik5')

    if (sectionTitleElem && sectionTitleElem.textContent !== 'Locations') {
        return null
    }

    const title = ad.querySelector('[data-testid=marketplace_pdp_title]')
    const description = ad.querySelector('p._4etw > span')
    const price = ad.querySelector('._ohe ._5_md._2iel')
    const renter = ad.querySelector('span._50f7._2iep._2iev')
    const cityLabelDiv = ad.querySelector('._3-8y._3qn7._61-0._2fyh._3qnf')

    const cityLabel = cityLabelDiv ?
        cityLabelDiv.textContent.includes('approximative')
            ? cityLabelDiv.querySelector('span')
            : cityLabelDiv.querySelector('._4m0t > span')
        : null

    const address = cityLabelDiv && !cityLabelDiv.textContent.includes('approximative')
        ? cityLabelDiv.querySelector('span:last-child')
        : null

    const features = [...ad.querySelectorAll('div._3-96._3qn7._61-0._2fyi._3qnf > div > span')]

    let furnished = null
    let surface = null
    let rooms = null

    features.forEach(feature => {
        if (feature.textContent.match(/mètres/g)) {
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
        id: getIdFromFacebookUrl(),
        address: address && address.textContent,
        cityLabel: cityLabel && cityLabel.textContent,
        description: description && description.textContent,
        furnished: furnished && furnished.textContent ? true : false,
        price: price && price.textContent,
        renter: renter && !renter.textContent.includes('particulier') ? renter.textContent : null,
        rooms: rooms && rooms.textContent,
        surface: surface && surface.textContent,
        title: title && title.textContent,
    }
}
