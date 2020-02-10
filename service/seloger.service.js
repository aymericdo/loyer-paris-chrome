const getIdFromSelogerUrl = () => {
    const url = window.location.toString()
    const match = url.match(/(?<=annonces\/locations(.)+)\d+(?=.htm)/g)
    return match ? match[0] : null
}

const selogerFireKeywords = () => ['description-bien']

const selogerScraping = () => {
    const title = document.querySelector('.detail-title.title1') || document.querySelector('.Title__ShowcaseTitleContainer-sc-4479bn-0.kXTaBk')
    const price = document.getElementById('price') || document.querySelector('.Summary__Text-sc-1wkzvu-6.Summary__PriceText-sc-1wkzvu-9.fulWhK')

    return [[title], [price]]
}

const getDataFromSelogerDOM = () => {
    const title = document.querySelector('.detail-title.title1') || document.querySelector('.Title__ShowcaseTitleContainer-sc-4479bn-0.kXTaBk')
    const description = document.querySelector('div.description-bien > section.categorie > p') || document.querySelector('.TitledDescription__TitledDescriptionContent-sc-1r4hqf5-1.dMkXAI')
    const price = document.getElementById('price') || document.querySelector('.Summary__Text-sc-1wkzvu-6.Summary__PriceText-sc-1wkzvu-9.fulWhK')
    const cityLabel = document.querySelector('.resume p.localite') || document.querySelector('#top .Summary__TopLeftWrapper-sc-1wkzvu-2.cRdFIp .Summary__Text-sc-1wkzvu-6.gcWjRm:last-child')
    const renter = document.querySelector('.agence-title') || document.querySelector('.LightSummary__Title-f6k8ax-2.kqLAJb')
    const itemTags = (document.querySelector('.resume ul.criterion > li') && [...document.querySelectorAll('.resume ul.criterion > li')]) || (document.querySelector('.Summary__TagsWrapper-sc-1wkzvu-7.emAUgN > div') && [...document.querySelectorAll('.Summary__TagsWrapper-sc-1wkzvu-7.emAUgN > div')])
    const optionsSection = (document.querySelector('section.categorie .criteria-wrapper > div') && [...document.querySelectorAll('section.categorie .criteria-wrapper > div')]) || (document.querySelector('.GeneralList__List-sc-9gtpjm-0.BAyYz > li') && [...document.querySelectorAll('.GeneralList__List-sc-9gtpjm-0.BAyYz > li')])
    const chargesElement = document.querySelector('section.categorie.with-padding-bottom .sh-text-light') || document.querySelector('#a-propos-de-ce-prix .TitledDescription__TitledDescriptionContent-sc-1r4hqf5-1.dMkXAI > div')

    let surface = null
    let rooms = null

    let chargesArray = chargesElement && chargesElement.innerHTML.split('span')
    let chargesIndex = chargesArray && chargesArray.indexOf(chargesArray.find(elem => elem.search('charges') !== -1))
    let charges = chargesArray && chargesArray.length && chargesArray[chargesIndex + 1]

    if (!charges) {
        chargesArray = chargesElement && chargesElement.innerHTML.split(' ')
        chargesIndex = chargesArray && chargesArray.indexOf(chargesArray.find(elem => elem.search('forfaitaires') !== -1))
        charges = chargesArray && chargesArray.length && chargesArray[chargesIndex + 2]
    }

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
