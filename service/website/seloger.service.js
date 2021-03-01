class SelogerWebsite extends WebsiteService {
  getId() {
    const url = window.location.toString();
    const match = url.match(/(?<=annonces\/locations\/(.)+)\d+(?=.htm)/g);
    return match ? match[0] : null;
  }
}
