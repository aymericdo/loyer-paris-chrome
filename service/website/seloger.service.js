class SelogerWebsite extends WebsiteService {
  getId() {
    const { pathname } = new URL(window.location.toString());
    const match =
      pathname.match(/^\/annonce\/location\/(?:[^/]+\/)+([a-zA-Z0-9]+)\/?$/) ||
      pathname.match(/^\/annonces\/locations\/(?:[^/]+\/)+(\d+)\.htm\/?$/);
    return match ? match[1] : null;
  }
}
