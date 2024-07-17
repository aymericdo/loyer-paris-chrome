const customizeService = new CustomizeService()
const fetcherService = new FetcherService(customizeService);

const watch = () => {
  customizeService.resetCustomization()

  const websiteService = WebsiteService.getCurrentWebsite();
  fetcherService.setWebsiteService(websiteService)

  if (websiteService.isValidPage()) {
    waitForElm(websiteService.fireKeyword).then(async () => {
      await fetcherService.fetchData()
    });
  }
}

watch()

window.navigation.addEventListener("navigate", (event) => {
  setTimeout(() => {
    watch()
  }, 1000);
})
