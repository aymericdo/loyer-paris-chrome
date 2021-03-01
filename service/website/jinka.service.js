class JinkaWebsite extends WebsiteService {
  fireKeyword = "._alert_result";

  getId() {
    const url = window.location.toString();
    const match = url.match(/(?<=ad=)\d+/g);
    return match ? match[0] : null;
  }
}
