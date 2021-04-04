class LocServiceWebsite extends WebsiteService {
  getId() {
    const url = window.location.toString();
    const match = url.match(/(?<=\/(.)+\/)\d+(?=.html)/g);
    return match ? match[0] : null;
  }
}
