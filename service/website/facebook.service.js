class FacebookWebsite extends WebsiteService {
  constructor() {
    super();
    // this.fireKeyword = "div[data-pagelet=root]";
  }

  getId() {
    const url = window.location.toString();
    const match = url.match(/(?<=marketplace\/item\/)\d+/g);
    return match ? match[0] : null;
  }

  getData() {
    const body = document.querySelector("html div[data-pagelet=root]");

    if (!body) return null;

    return JSON.stringify(body.outerHTML);
  }
}
