const getIdFromLeboncoinUrl = () => {
    const url = window.location.toString()
    const match = url.match(/\d+(?=.htm)/)
    return match ? match[0] : null
}

const leboncoinScraping = () => {
    const titles = [...document.querySelectorAll('[data-qa-id=adview_title] h1, [data-qa-id=adview_title] h3')]
    const prices = [...document.querySelectorAll('[data-qa-id=adview_price]')].map(node => node.firstChild)

    return [titles, prices]
}
