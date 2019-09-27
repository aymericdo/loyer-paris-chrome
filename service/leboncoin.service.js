const getIdFromLeboncoinUrl = () => {
    const url = window.location.toString()
    return url.match(/\d+(?=.htm)/)[0]
}

const leboncoinScraping = () => {
    const titles = [...document.querySelectorAll('[data-qa-id=adview_title] h1, [data-qa-id=adview_title] h3')]
    const prices = [...document.querySelectorAll('[data-qa-id=adview_price]')].map(node => node.firstChild)

    return [titles, prices]
}

const getDataFromLeboncoinScriptInDOM = () => {
    const scripts = document.getElementsByTagName('script');
    const dataScript = [...scripts].find(s => s.textContent.substring(3, 20) === 'window.FLUX_STATE')
    return dataScript ? JSON.parse(dataScript.textContent.slice(23, -1)).adview : null
}
