const getIdFromSelogerUrl = () => {
    const url = window.location.toString()
    const match = url.match(/\d+(?=.htm)/)
    return match ? match[0] : null
}

const selogerScraping = () => {
    const title = document.querySelector('.detail-title.title1')
    const price = document.getElementById('price')

    return [[title], [price]]
}
