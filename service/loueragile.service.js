const getIdFromLoueragileUrl = () => {
    const url = window.location.toString()
    const match = url.match(/(?<=ad=)\d+/g)
    return match ? match[0] : null
}

const loueragileScraping = () => {
    const titles = [...document.querySelectorAll("#root > div._alert_result.sc-bdVaJa.eyCtMk > div > div.sc-bdVaJa.dRoUBI > div.sc-bdVaJa.deoPit > div.sc-bdVaJa.blRsro > div > h2")]
    const prices = [document.querySelector("#root > div._alert_result.sc-bdVaJa.eyCtMk > div > div.sc-bdVaJa.dRoUBI > div.sc-bdVaJa.deoPit > div.sc-bdVaJa.blRsro > p"),
        document.querySelector("#root > div._alert_result.sc-bdVaJa.eyCtMk > div > div.sc-bdVaJa.dRoUBI > div.sc-bdVaJa.deoPit > div.sc-bdVaJa.blRsro > div > div > span")]
    return [titles, prices]
}

const loueragileFireKeywords = () => ['_alert_result']
