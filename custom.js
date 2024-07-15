let websiteService = WebsiteService.getCurrentWebsite();
const fetcherService = new FetcherService();
const customizeService = new CustomizeService();
let isFetched = false;

let timer;
let timer2;

const observer = new MutationObserver((mutations, observer) => {
  if (timer) clearTimeout(timer);
  mutations.forEach(async (mutation) => {
    if (!mutation.addedNodes) return;

    for (let i = 0; i < mutation.addedNodes.length; i++) {
      const node = mutation.addedNodes[i];

      try {
        if (
          !isFetched &&
          !!node &&
          !!node.querySelector(websiteService.fireKeyword &&
            !!node.querySelector(websiteService.fireKeyword).textContent)
        ) {
          await fetcherService.fetchData();
          isFetched = true;
          observer.disconnect();
        }
      } catch (err) {
        // console.log(err);
      }
    }
  });

  timer = setTimeout(async () => {
    if (!isFetched) {
      await fetcherService.fetchData();
      isFetched = true;
      observer.disconnect();
    }
  }, 3000);
});

const letsObserve = async () => {
  observer.disconnect();
  if (timer2) clearTimeout(timer2);

  if (fetcherService.isBlackListed(
    websiteService.currentDomain,
    websiteService.getId()
  )) {
    return;
  }

  isFetched = false;
  if (
    fetcherService.isAlreadyFetched(
      websiteService.currentDomain,
      websiteService.getId()
    )
  ) {
    customizeService.decorate(
      fetcherService.adsChecked.find(
        ({ domain, id }) =>
          domain === websiteService.currentDomain &&
          id === websiteService.getId()
      ).ad
    );
  } else if (websiteService.currentDomain === "facebook") {
    // Because we can open an ad popup in facebook and we can't detect when this second 'page'
    // on top of the first one is load for sure, we just wait 3 seconds for each facebook page
    // -> facebook sucks
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: false,
      characterData: false,
    });
  } else if (websiteService.fireKeyword === null) {
    await fetcherService.fetchData();
    isFetched = true;
  } else if (!!document.body.querySelector(websiteService.fireKeyword) && !!document.body.querySelector(websiteService.fireKeyword).textContent) {
    // Need a timeout here because sometime, the dom is staying with all old elements, so, it's just to be sure it's ok
    // (Problem encountered on lux-residence)
    timer2 = setTimeout(async () => {
      await fetcherService.fetchData();
      isFetched = true;
    }, 500);
  } else {
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: false,
      characterData: false,
    });
  }
};

if (websiteService.isValidPage()) {
  letsObserve();
} else {
  observer.disconnect();
}
