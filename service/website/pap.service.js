const getIdFromPapUrl = () => {
    const url = window.location.toString()
    const match = url.match(/(?<=annonces\/appartement(.)+)(?<=-)r\d+/g)
    const sectionName = document.querySelector('[itemprop=itemListElement] > a[itemprop=item] > span[itemprop=name]')
    return match && sectionName.textContent.trim().includes('Location') ? match[0] : null
}

const papScraping = () => {
    const titles = [...document.querySelectorAll('h1.item-title')]
    const prices = [...document.querySelectorAll('h1.item-title > span.item-price')]

    return [titles, prices]
}

const getDataFromPapDOM = () => {
    const body = document.querySelector('html > body')

    return {
        data: JSON.stringify(body.outerHTML),
    }
}
