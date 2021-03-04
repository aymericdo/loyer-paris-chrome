class FetcherService {
  adsChecked = [];
  fetchingForIds = [];

  constructor() {}

  fetchData() {
    const ad = this.adsChecked.find(({ domain, id }) => domain === websiteService.currentDomain && id === websiteService.getId())

    if (ad) {
      customizeService.decorate(ad.ad)
    } else {
      this.checkExtensionVersion();
      this.checkAd();
    }
  }

  isAlreadyFetched(d, i) {
    return this.adsChecked.some(({ domain, id }) => domain === d && id === i)
  }

  // Private
  buildRequest(dataParam) {
    let data = { platform: PLATFORM, id: websiteService.getId() };
  
    if (!dataParam) {
      data = { ...data, noMoreData: true };
    } else {
      data = { ...data, ...dataParam };
    }
  
    return {
      url: `${SERVER}/${websiteService.currentDomain}/data/v2`,
      opts: { method: "post", body: JSON.stringify(data) },
    };
  }

  checkAd() {
    const data = websiteService.getData();
    const request = this.buildRequest(data);

    if (this.fetchingForIds.some(id => id === websiteService.getId())) {
      return null
    }

    this.fetchingForIds.push(websiteService.getId());
    fetch(request.url, request.opts)
      .then(middlewareJson)
      .then(middlewareErrorCatcher)
      .then(this.handleSuccess)
      .catch(this.handleError);
  };

  checkExtensionVersion() {
    const manifestData = chrome.runtime.getManifest();
    const url = `${SERVER}/version?version=${manifestData.version}&platform=${PLATFORM}`
    fetch(url)
      .then(middlewareJson)
      .then(middlewareErrorCatcher)
      .then((isOutdated) => {
        if (isOutdated) {
          customizeService.addErrorBanner({ error: "outdated" });
        }
      });
  }

  handleSuccess = (myJson) => {
    const currentAd = { ...myJson };
    this.adsChecked.push({
      domain: websiteService.currentDomain,
      id: websiteService.getId(),
      ad: currentAd,
    });
    this.fetchingForIds = this.fetchingForIds.filter(id => websiteService.getId() !== id);
    customizeService.decorate(currentAd)
  }

  handleError = (err) => {
    this.fetchingForIds = this.fetchingForIds.filter(id => websiteService.getId() !== id);
    customizeService.addErrorBanner(err);
  }
}