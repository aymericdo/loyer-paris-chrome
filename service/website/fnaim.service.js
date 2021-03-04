class FnaimWebsite extends WebsiteService {
  fireKeyword = '[itemprop=name]';

  getId() {
    const url = window.location.toString();
    const match = url.match(/(?<=annonce-immobiliere\/)\d+(?=\/(.)+.htm)/g)
    return match ? match[0] : null;
  }
}
