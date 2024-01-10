class LeboncoinWebsite extends WebsiteService {
  constructor() {
    super();
    this.fireKeyword = '#map';
  }

  getId() {
    const url = window.location.toString()
    const match = url.match(/(?<=\/locations\/)\d+/g) || url.match(/(?<=\/locations\/)\d+(?=.htm)/g) || url.match(/(?<=\/vi\/)\d+(?=.htm)/g)
    return match ? match[0] : null
  }
}
