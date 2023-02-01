class GensdeconfianceWebsite extends WebsiteService {
  getId() {
    const url = window.location.toString()
    const match = url.match(/(?<=annonce\/(.)+-)(\d|[a-z])+(?=\?)/g)
    const match2 = url.match(/(?<=annonce\/(.)+-)(\d|[a-z])+/g)
    return match ? match[0] : match2 ? match2[match2.length - 1] : null
  }
}
