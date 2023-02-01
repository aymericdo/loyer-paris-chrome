chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === "activateIcon") {
    // chrome.action.show(sender.tab.id);
  } else if (request.message === "redirectSettings") {
    chrome.tabs.create({ 'url': 'chrome://extensions/?options=' + chrome.runtime.id });
  }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    if (isAvailableUrl(tab.url)) {
      chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
        if (tabs.length) {
          chrome.tabs.sendMessage(tabs[0].id, { message: "urlHasChanged" });
        }
      });
    }
  }
});

function isAvailableUrl(url) {
  if (!url) return null;

  return ['seloger.com',
    'leboncoin.fr',
    'jinka.fr',
    'pap.fr',
    'logic-immo.com',
    'immobilier.lefigaro.fr',
    'facebook.com/marketplace',
    'orpi.com',
    'gensdeconfiance.com',
    'bellesdemeures.com',
    'lux-residence.com',
    'bienici.com',
    'fnaim.fr',
    'superimmo.com',
    'locservice.fr'].some((u) => url.includes(u));
}
