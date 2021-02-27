const getIdFromSelogerUrl = () => {
    const url = window.location.toString()
    const match = url.match(/(?<=annonces\/locations(.)+)\d+(?=.htm)/g)
    return match ? match[0] : null
}

const selogerScraping = () => {
    const title = document.querySelector('.detail-title.title1') || document.querySelector('.Title__ShowcaseTitleContainer-sc-4479bn-0')
    const price = document.getElementById('price') || document.querySelector('.Summary__Text-sc-1wkzvu-6.Summary__PriceText-sc-1wkzvu-9.fulWhK') || document.querySelector('.Summarystyled__PriceContainer-tzuaot-7')

    return [[title], [price]]
}

const getDataFromSelogerDOM = () => {
    const body = document.querySelector('html > body')

    return {
        data: JSON.stringify(body.outerHTML),
    }
}
