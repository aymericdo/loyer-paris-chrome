const getIdFromOrpiUrl = () => {
    const url = window.location.toString()
    const match = url.match(/(?<=annonce-location-appartement.*)b-.*(?=\/)/g)
    return match ? match[0] : null
}

const orpiScraping = () => {
    const titles = [...document.querySelectorAll('h1 > span.u-text-xl')]
    const prices = [...document.querySelectorAll('span.u-h1')]

    return [titles, prices]
}

const getDataFromOrpiDOM = () => {
    const body = document.querySelector('html > body')

    return {
        data: JSON.stringify(body.outerHTML),
    }
}
