const getIdFromLefigaroUrl = () => {
    const url = window.location.toString()
    const match = url.match(/(?<=annonces\/annonce-).*(?=.html)/g)
    return match ? match[0] : null
}

const lefigaroScraping = () => {
    const titles = [...document.querySelectorAll('#contenu > .container-h1 > h1')]
    const prices = [...document.querySelectorAll('div.container-price span.price, .partners-with-price dd')]

    return [titles, prices]
}

const getDataFromLefigaroDOM = () => {
    const body = document.querySelector('html > body')

    return {
        data: JSON.stringify(body.outerHTML),
    }
}
