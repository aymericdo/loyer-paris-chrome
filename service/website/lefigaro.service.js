class LefigaroWebsite extends WebsiteService {
  getId() {
    const url = window.location.toString();
    const match = url.match(/(?<=annonces\/annonce-).*(?=.html)/g);
    return match ? match[0] : null;
  }
}
