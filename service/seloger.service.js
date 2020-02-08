const getIdFromSelogerUrl = () => {
    const url = window.location.toString()
    const match = url.match(/(?<=annonces\/locations(.)+)\d+(?=.htm)/g)
    return match ? match[0] : null
}

const selogerFireKeywords = () => ['description-bien']

const selogerScraping = () => {
    const title = document.querySelector('.Title__ShowcaseTitleContainer-sc-4479bn-0.kXTaBk')
    const price = document.querySelector('.Summary__Text-sc-1wkzvu-6.Summary__PriceText-sc-1wkzvu-9.fulWhK')

    return [[title], [price]]
}

const getDataFromSelogerDOM = () => {
    const title = document.querySelector('.Title__ShowcaseTitleContainer-sc-4479bn-0.kXTaBk')
    const description = document.querySelector('.TitledDescription__TitledDescriptionContent-sc-1r4hqf5-1.dMkXAI')
    const price = document.querySelector('.Summary__Text-sc-1wkzvu-6.Summary__PriceText-sc-1wkzvu-9.fulWhK')
    const cityLabel = document.querySelector('#top .Summary__TopLeftWrapper-sc-1wkzvu-2.cRdFIp .Summary__Text-sc-1wkzvu-6.gcWjRm:last-child')
    const renter = document.querySelector('.LightSummary__Title-f6k8ax-2.kqLAJb')
    const itemTags = [...document.querySelectorAll('.Summary__TagsWrapper-sc-1wkzvu-7.emAUgN > div')]
    const optionsSection = [...document.querySelectorAll('.GeneralList__List-sc-9gtpjm-0.BAyYz > li')]
    const chargesElement = document.querySelector('#a-propos-de-ce-prix .TitledDescription__TitledDescriptionContent-sc-1r4hqf5-1.dMkXAI > div')

    let surface = null
    let rooms = null
    const chargesArray = chargesElement && chargesElement.innerHTML.split(' ')
    const chargesIndex = chargesArray && chargesArray.indexOf(chargesArray.find(elem => elem.search('forfaitaires') !== -1))
    const charges = chargesArray && chargesArray.length && chargesArray[chargesIndex + 2]

    const furnished = optionsSection.some(el => {
        return el.textContent.match(/^Meublé/g)
    })

    const yearBuilt = optionsSection.find(el => {
        return el.textContent.match(/^Année de construction/g)
    })

    itemTags.forEach(tag => {
        if (tag.textContent.match(/m²/g)) {
            surface = tag
        } else if (tag.textContent.match(/pièce/g)) {
            rooms = tag
        }
    })

    if (!title && !description && !price && !cityLabel) {
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
        yearBuilt: yearBuilt && yearBuilt.textContent,
        title: title && title.textContent,
    }
}
