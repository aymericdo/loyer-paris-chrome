class LogicimmoWebsite extends WebsiteService {
  getId() {
    const url = window.location.toString();
    const match = url.match(/(?<=detail-location-).*(?=.htm)/);
    return match ? match[0] : null;
  }
}
