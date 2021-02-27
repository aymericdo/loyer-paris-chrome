const getIdFromGensdeconfianceUrl = () => {
  const url = window.location.toString()
  const match = url.match(/(?<=annonce\/(location|loue|je-loue)(.)+-)(\d|[a-z])+(?=\?)/g)
  const match2 = url.match(/(?<=annonce\/(location|loue|je-loue)(.)+-)(\d|[a-z])+/g)
  return match ? match[0] : match2 ? match2[match2.length - 1] : null
}

const gensdeconfianceScraping = () => {
  const titles = [document.querySelector("#post-title")]
  const prices = [document.querySelector("#col-ad > div.price-table > div:nth-child(1) > div.price-table__value")]

  return [titles, prices]
}

const getDataFromGensdeconfianceDOM = () => {
  const body = document.querySelector('html > body')

    return {
        data: JSON.stringify(body.outerHTML),
    }
}
