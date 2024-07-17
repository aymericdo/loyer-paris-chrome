class FonciaWebsite extends WebsiteService {
  getId() {
    const url = window.location.toString();
    const match = url.match(/(?<=location\/.*)\d+(?=\.htm)/g)
    return match ? match[0] : null;
  }
}
