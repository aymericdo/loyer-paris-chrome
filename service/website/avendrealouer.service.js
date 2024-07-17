class AvendrealouerWebsite extends WebsiteService {
  constructor() {
    super();
    this.fireKeyword = '#debutBlocDetail';
  }

  getId() {
    const url = window.location.toString();
    const match = url.match(/(?<=location\/.*)fd-.*(?=\.html)/g)
    return match ? match[0] : null;
  }
}
