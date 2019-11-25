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
    const chargesElement = [...document.querySelectorAll('.o-grid > .o-grid__col .u-list-unstyled.u-text-xs > li')]
    const charges = chargesElement.find(element => element.textContent.search('Provisions pour charges') !== -1)
    const hasChargesElement = document.querySelector('p.u-mt-n > span.u-h1')
    const hasCharges = hasChargesElement && hasChargesElement.parentNode && hasChargesElement.parentNode.textContent.includes('charges comprises')

    return {
        id: data.prdref,
        cityLabel: data.nomVille,
        coord: {
            lng: data.longitude,
            lat: data.latitude,
        },
        charges: charges && charges.textContent,
        hasCharges,
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
