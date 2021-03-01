class BellesDemeuresWebsite extends WebsiteService {
  getId() {
    const url = window.location.toString();
    const match = url.match(/(?<=annonces\/location\/(.)+\/)\d+(?=\/)/g)
    return match ? match[0] : null;
  }
}
