class PapWebsite extends WebsiteService {
  getId() {
    const url = window.location.toString();
    const match = url.match(/(?<=annonces\/appartement(.)+)(?<=-)r\d+/g);
    const sectionName = document.querySelector(
      "[itemprop=itemListElement] > a[itemprop=item] > span[itemprop=name]"
    );
    return match && sectionName.textContent.trim().includes("Location")
      ? match[0]
      : null;
  }
}
