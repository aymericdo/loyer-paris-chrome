const getIdFromGensdeconfianceUrl = () => {
  const url = window.location.toString()
  const match = url.match(/(?<=annonce\/(location|loue)(.)+-)(\d|[a-z])+(?=\?)/g)
  const match2 = url.match(/(?<=annonce\/(location|loue)(.)+-)(\d|[a-z])+/g)
  return match ? match[0] : match2 ? match2[match2.length - 1] : null
}

const gensdeconfianceScraping = () => {
  const titles = [document.querySelector("#post-title")]
  const prices = [document.querySelector("#col-ad > div.price-table > div:nth-child(1) > div.price-table__value")]

  return [titles, prices]
}

const getDataFromGensdeconfianceDOM = () => {
  const title = document.querySelector("#post-title")
  const description = document.querySelector("#ad-description")
  const price = document.querySelector("#col-ad > div.price-table > div:nth-child(1) > div.price-table__value")
  const charges = document.querySelector("#col-ad > div.price-table > div:nth-child(2) > div.price-table__value")
  const address = document.querySelector("#ad-address > p")
  const cityLabel = document.querySelector("#post-title-breadcrumb > small")
  const surface = document.querySelector("#ad-extra-fields-nb_square_meters")

  if (!title) {
      return null
  }

  const cityLabelText = cityLabel && cityLabel.textContent.normalize("NFD").replace(/[\u0300-\u036f]/g, "").split('—')[1]

  return {
      id: getIdFromGensdeconfianceUrl(),
      cityLabel: cityLabelText,
      address: address && address.textContent,
      charges: charges && charges.textContent,
      hasCharges: charges && charges.textContent && charges.textContent.match(/\d+/)[0] && +charges.textContent.match(/\d+/)[0] > 0,
      description: description && description.textContent,
      price: price && price.textContent,
      surface: surface && surface.textContent,
      title: title && title.textContent,
  }
}
