class FetcherService {
  customizeService = null
  websiteService = null

  adsChecked = []
  fetchingForIds = []

  constructor(customizeService) {
    this.customizeService = customizeService
  }

  setWebsiteService(websiteService) {
    this.websiteService = websiteService;
  }

  async fetchData() {
    if (!this.websiteService) return;

    const ad = this.adsChecked.find(
      ({ domain, id }) =>
        domain === this.websiteService.currentDomain && id === this.websiteService.getId()
    );

    if (ad) {
      this.customizeService.decorate(ad.ad);
    } else {
      await this.checkAd();
    }
  }

  // Private
  buildRequest(dataParam) {
    let data = {
      platform: PLATFORM,
      id: this.websiteService.getId(),
      url: window.location.toString(),
    };

    if (!dataParam) {
      data["noMoreData"] = true;
    } else {
      data["data"] = dataParam;
    }

    return {
      url: `${SERVER}/${this.websiteService.currentDomain}/data/v2`,
      opts: { method: "post", body: JSON.stringify(data) },
    };
  }

  async checkAd() {
    const data = this.websiteService.getData();
    const request = this.buildRequest(data);

    if (this.fetchingForIds.some((id) => id === this.websiteService.getId())) {
      return null;
    }

    this.fetchingForIds.push(this.websiteService.getId());
    try {
      const result = await fetch(request.url, request.opts)
      const myJson = await result.json()

      middlewareErrorCatcher(myJson)

      this.handleSuccess(myJson)
    } catch (error) {
      console.log(JSON.stringify(error))
      this.customizeService.addErrorBanner(error);
    } finally {
      this.fetchingForIds = this.fetchingForIds.filter(
        (id) => this.websiteService.getId() !== id
      );
    }
  }

  handleSuccess(myJson) {
    const currentAd = { ...myJson };
    this.adsChecked.push({
      domain: this.websiteService.currentDomain,
      id: this.websiteService.getId(),
      ad: currentAd,
    });

    this.customizeService.decorate(currentAd);
  }
}
