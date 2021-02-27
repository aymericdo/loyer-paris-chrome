const getDomain = () => {
  const url = window.location.toString();
  return url
    .split("/")[2]
    .replace("www.", "")
    .replace("immobilier.", "")
    .split(".")[0];
};

const getIdByDomain = () => {
  switch (getDomain()) {
    case "leboncoin":
      return getIdFromLeboncoinUrl();
    case "seloger":
      return getIdFromSelogerUrl();
    case "jinka":
      return getIdFromLoueragileUrl();
    case "pap":
      return getIdFromPapUrl();
    case "logic-immo":
      return getIdFromLogicimmoUrl();
    case "lefigaro":
      return getIdFromLefigaroUrl();
    case "orpi":
      return getIdFromOrpiUrl();
    case "facebook":
      return getIdFromFacebookUrl();
    case "gensdeconfiance":
      return getIdFromGensdeconfianceUrl();
    case "lux-residence":
      return getIdFromLuxResidenceUrl();
    case "bellesdemeures":
      return getIdFromBellesdemeuresUrl();
    default:
      return null;
  }
};

let currentDomain = getDomain();
let currentId = getIdByDomain();
let alreadyChecked = [];
let currentAd = null;
const platform = "chrome";
const customizeService = new CustomizeService();

const fireKeywords =
  currentDomain === "facebook"
    ? facebookFireKeywords()
    : currentDomain === "jinka"
    ? loueragileFireKeywords()
    : null;

const activateTab = () => {
  if (currentAd) {
    chrome.runtime.sendMessage({
      message: "activateIcon",
      ad: { ...currentAd },
    });
  }
};

const deactivateTab = () => {
  currentAd = null;
  currentDomain = null;
  currentId = null;
  chrome.runtime.sendMessage({ message: "deactivateIcon" });
};

const customizeTab = (ad) => {
  activateTab();

  customizeService.decorate(ad)
}

const addErrorBanner = (error) => {
  switch (error.error) {
    case "city": {
      customizeService.addDescriptionHelper(
        "La ville de cette annonce n'a pas encore mis en place l'encadrement des loyers.",
        false
      );
      break;
    }
    case "address": {
      customizeService.addDescriptionHelper(
        "Nous n'avons pas trouvé d'adresse pour cette annonce.",
        false
      );
      break;
    }
    case "minimal": {
      customizeService.addDescriptionHelper(
        "Nous n'avons pas trouvé les informations nécessaires pour cette annonce.",
        false
      );
      break;
    }
    case "price": {
      customizeService.addDescriptionHelper(
        "Le prix de l'annonce semble être incohérent.",
        false
      );
      break;
    }
    case "partner": {
      customizeService.addDescriptionHelper(
        "Nous avons rencontré un problème de communication interne.",
        false
      );
      break;
    }
    case "filter": {
      customizeService.addDescriptionHelper("Nous avons pas trouvé de correspondance.", false);
      break;
    }
    case "outdated": {
      customizeService.addDescriptionHelper(
        "L'extension n'est plus à jour. Vous pouvez la mettre à jour manuellement dans les réglages.",
        false
      );
      break;
    }
    default: {
      customizeService.addDescriptionHelper(
        error.msg ||
          "Erreur : nous allons résoudre ce problème pour cette annonce sous peu",
        false
      );
      break;
    }
  }
}

const fetchDataFromJSON = (dataParam) => {
  let data = { platform, id: currentId };

  if (!dataParam) {
    data = { ...data, noMoreData: true };
  } else {
    data = { ...data, ...dataParam };
  }

  return {
    url: `${server}/${currentDomain}/data/v2`,
    opts: { method: "post", body: JSON.stringify(data) },
  };
};

const isExtensionUpToDate = (version) => {
  return { url: `${server}/version?version=${version}&platform=${platform}` };
};

const checkExtensionVersion = () => {
  const manifestData = chrome.runtime.getManifest();
  const request = isExtensionUpToDate(manifestData.version);
  fetch(request.url)
    .then(middlewareJson)
    .then(middlewareErrorCatcher)
    .then((isOutdated) => {
      if (isOutdated) {
        addErrorBanner({ error: "outdated" });
      }
    });
};

const fetchData = () => {
  let request = null;
  checkExtensionVersion();
  if (currentDomain === "leboncoin") {
    const data = getDataFromLeboncoinDOM();
    request = fetchDataFromJSON(data);
  } else if (currentDomain === "seloger") {
    const data = getDataFromSelogerDOM();
    request = fetchDataFromJSON(data);
  } else if (currentDomain === "jinka") {
    const id = getIdFromLoueragileUrl();
    request = fetchDataFromJSON(id ? { id } : null);
  } else if (currentDomain === "pap") {
    const data = getDataFromPapDOM();
    request = fetchDataFromJSON(data);
  } else if (currentDomain === "logic-immo") {
    const data = getDataFromLogicimmoDOM();
    request = fetchDataFromJSON(data);
  } else if (currentDomain === "lefigaro") {
    const data = getDataFromLefigaroDOM();
    request = fetchDataFromJSON(data);
  } else if (currentDomain === "orpi") {
    const data = getDataFromOrpiDOM();
    request = fetchDataFromJSON(data);
  } else if (currentDomain === "facebook") {
    const data = getDataFromFacebookDOM();
    request = fetchDataFromJSON(data);
  } else if (currentDomain === "gensdeconfiance") {
    const data = getDataFromGensdeconfianceDOM();
    request = fetchDataFromJSON(data);
  }

  if (request) {
    requestResolver(request, (err) => {
      addErrorBanner(err);
    });
  }
};

const requestResolver = (request, catchCallback) => {
  alreadyChecked.push({
    domain: currentDomain,
    id: currentId,
    ad: { ...currentAd },
  });
  const fetched = fetch(request.url, request.opts);
  fetched
    .then(middlewareJson)
    .then(middlewareErrorCatcher)
    .then(handleSuccess)
    .catch(catchCallback);
};

const handleSuccess = (myJson) => {
  currentAd = { ...myJson };
  customizeTab({ ...myJson });
};

let isFetched = false;
chrome.extension.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === "tabHasChanged") {
    activateTab();
  } else if (request.message === "urlHasChanged") {
    const newDomain = getDomain();
    const newId = getIdByDomain();
    if (newId === null) {
      deactivateTab();
      observer.disconnect();
    } else if (
      !alreadyChecked.some(
        ({ domain, id }) => domain === newDomain && id === newId
      )
    ) {
      currentDomain = newDomain;
      currentId = newId;
      isFetched = false;
      letsObserve();
    } else if (newDomain === "facebook") {
      const ad = alreadyChecked.find(
        ({ domain, id }) => domain === newDomain && id === newId
      );
      currentDomain = newDomain;
      currentId = newId;
      currentAd = ad.ad;
      activateTab();
    }
  }
});

let timer;
const observer = new MutationObserver((mutations, observer) => {
  if (timer) clearTimeout(timer);
  mutations.forEach((mutation) => {
    if (!mutation.addedNodes) return;

    for (let i = 0; i < mutation.addedNodes.length; i++) {
      const node = mutation.addedNodes[i];

      try {
        if (!isFetched && !!node && !!node.querySelector(fireKeywords)) {
          fetchData();
          isFetched = true;
          observer.disconnect();
        }
      } catch (err) {
        // console.log(err);
      }
    }
  });

  timer = setTimeout(() => {
    if (!isFetched) {
      fetchData();
      isFetched = true;
      observer.disconnect();
    }
  }, 3000);
});

const letsObserve = () => {
  if (fireKeywords === null) {
    fetchData();
    observer.disconnect();
  } else {
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: false,
      characterData: false,
    });
  }
};

if (currentId) {
  letsObserve();
} else {
  observer.disconnect();
}
