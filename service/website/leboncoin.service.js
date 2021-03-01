class LeboncoinWebsite extends WebsiteService {
  getId() {
    const url = window.location.toString()
    const match = url.match(/(?<=\/locations\/)\d+(?=.htm)/g) || url.match(/(?<=\/vi\/)\d+(?=.htm)/g)
    return match ? match[0] : null
  }
}
