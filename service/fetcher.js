class FetcherService {
  constructor() {
    this.adsChecked = [];
    this.adsBlackListed = [];
    this.fetchingForIds = [];
  }

  async fetchData() {
    const ad = this.adsChecked.find(
      ({ domain, id }) =>
        domain === websiteService.currentDomain && id === websiteService.getId()
    );

    if (ad) {
      customizeService.decorate(ad.ad);
    } else {
      await this.checkAd();
    }
  }

  isAlreadyFetched(d, i) {
    return this.adsChecked.some(({ domain, id }) => domain === d && id === i);
  }

  isBlackListed(d, i) {
    return this.adsBlackListed.some(
      ({ domain, id }) => domain === d && id === i
    );
  }

  // Private
  buildRequest(dataParam) {
    let data = {
      platform: PLATFORM,
      id: websiteService.getId(),
      url: window.location.toString(),
    };

    if (!dataParam) {
      data["noMoreData"] = true;
    } else {
      data["data"] = dataParam;
    }

    return {
      url: `${SERVER}/${websiteService.currentDomain}/data/v2`,
      opts: { method: "post", body: JSON.stringify(data) },
    };
  }

  async checkAd() {
    const data = websiteService.getData();
    const request = this.buildRequest(data);

    if (this.fetchingForIds.some((id) => id === websiteService.getId())) {
      return null;
    }

    this.fetchingForIds.push(websiteService.getId());
    try {
      const result = await fetch(request.url, request.opts)
      const myJson = await result.json()

      middlewareErrorCatcher(myJson)

      this.handleSuccess(myJson)
    } catch (error) {
      console.error(JSON.stringify(error))
      this.handleError(error)
    }
  }

  handleSuccess(myJson) {
    const currentAd = { ...myJson };
    this.adsChecked.push({
      domain: websiteService.currentDomain,
      id: websiteService.getId(),
      ad: currentAd,
    });
    this.fetchingForIds = this.fetchingForIds.filter(
      (id) => websiteService.getId() !== id
    );
    customizeService.decorate(currentAd);
  }

  handleError(err) {
    this.fetchingForIds = this.fetchingForIds.filter(
      (id) => websiteService.getId() !== id
    );
    if (["city", "minimal", "address", "price", "surface", "partner", "filter", "other"].includes(err.error)) {
      this.adsBlackListed.push({
        domain: websiteService.currentDomain,
        id: websiteService.getId(),
      });
    }
    customizeService.addErrorBanner(err);
  }
}
