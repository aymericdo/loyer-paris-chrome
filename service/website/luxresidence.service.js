class LuxResidenceWebsite extends WebsiteService {
  getId() {
    const url = window.location.toString();
    const match = url.match(/(?<=location\/appartement\/(.)+\/)[A-Z0-9\-]+/g);
    return match ? match[match.length - 1] : null;
  }
}
