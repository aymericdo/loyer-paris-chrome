class BienIciWebsite extends WebsiteService {
  fireKeyword = '.detailedSheetFirstBlock';

  getId() {
    const url = window.location.toString();
    const match = url.match(/(?<=annonce\/location\/(.)+\/)[a-zA-Z0-9-]+/g)
    return match ? match[match.length - 1] : null;
  }
}
