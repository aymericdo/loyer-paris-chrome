class SuperimmoWebsite extends WebsiteService {
  getId() {
    const url = window.location.toString();
    const match = url.match(/(?<=annonces\/location.+)[a-z0-9]+/g)
    return match ? match[match.length - 1] : null;
  }
}
