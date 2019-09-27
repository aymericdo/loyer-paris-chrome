const getIdFromLoueragileUrl = () => {
    const url = window.location.toString()
    return url.match(/(?<=ad=)\d+/)[0]
}

const loueragileScraping = () => {
    const titles = [...document.querySelectorAll('.h2-like')]

    return [titles, []]
}
