const getIdFromLogicimmoUrl = () => {
    const url = window.location.toString()
    const match = url.match(/(?<=detail-location-).*(?=.htm)/)
    return match ? match[0] : null
}

const logicimmoScraping = () => {
    const titles = [...document.querySelectorAll('h2.offerMainFeatures')]
    const prices = [...document.querySelectorAll('div.rightSide > .price > div')]

    return [titles, prices]
}

const getDataFromLogicimmoDOM = () => {
    const body = document.querySelector('html > body')

    return {
        data: JSON.stringify(body.outerHTML),
    }
}
