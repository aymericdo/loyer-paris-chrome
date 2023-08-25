class PapWebsite extends WebsiteService {
  getId() {
    const url = window.location.toString();
    const match = url.match(/(?<=annonces\/appartement(.)+)(?<=-)r\d+/g);

    return match ? match[0] : null;
  }
}
