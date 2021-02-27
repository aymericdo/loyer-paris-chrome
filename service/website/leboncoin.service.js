const getIdFromLeboncoinUrl = () => {
    const url = window.location.toString()
    const match = url.match(/(?<=\/locations\/)\d+(?=.htm)/g) || url.match(/(?<=\/vi\/)\d+(?=.htm)/g)
    return match ? match[0] : null
}

const leboncoinScraping = () => {
    const titles = [document.querySelector('h1[data-qa-id=adview_title]'), document.querySelector('div[data-qa-id=adview_title] > div.styles_subject__3AeTh > p')]
    const prices = [...document.querySelectorAll('[data-qa-id=adview_price] > span')]

    return [titles, prices]
}

const getDataFromLeboncoinDOM = () => {
    const body = document.querySelector('html > body')

    return {
        data: JSON.stringify(body.outerHTML),
    }
}
