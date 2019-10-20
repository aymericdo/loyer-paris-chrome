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
    const dataDOM = document.querySelector('[data-component=estate-bookmark]')
    const data = JSON.parse(dataDOM.dataset.eulerianAction)
    const description = document.querySelector('div.o-container > p')

    return {
        id: data.prdref,
        cityLabel: data.nomVille,
        coord: {
            lng: data.longitude,
            lat: data.latitude,
        },
        description: description && description.textContent,
        furnished: !!data.meuble,
        postalCode: data.codePostal,
        price: data.prdamount,
        renter: data.agenceNom,
        rooms: data.nbPieces,
        surface: data.surfaceBien,
        title: data.prdname.replace(/-/g, ' '),
        yearBuilt: data.anneeConstruction,
    }
}
