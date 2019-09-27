const getIdFromSelogerUrl = () => {
    const url = window.location.toString()
    return url.match(/\d+(?=.htm)/)[0]
}

const selogerScraping = () => {
    const title = document.querySelector('.detail-title.title1')
    const price = document.getElementById('price')

    return [[title], [price]]
}
