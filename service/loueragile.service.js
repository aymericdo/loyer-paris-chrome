const getIdFromLoueragileUrl = () => {
    const url = window.location.toString()
    const match = url.match(/(?<=ad=)\d+/)
    return match ? match[0] : null
}

const loueragileScraping = () => {
    const titles = [...document.querySelectorAll('.h2-like')]

    return [titles, []]
}
