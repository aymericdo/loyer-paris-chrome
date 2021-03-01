class WebsiteService {
  fireKeyword = null;
  currentDomain = null;

  constructor() {
    this.currentDomain = WebsiteService.getDomain();
  }

  static getDomain() {
    try {
      return window.location.toString()
        .split("/")[2]
        .replace("www.", "")
        .replace("immobilier.", "")
        .split(".")[0];
    } catch {
      return null;
    }
  }

  static getCurrentWebsite() {
    switch (WebsiteService.getDomain()) {
      case "leboncoin":
        return new LeboncoinWebsite();
      case "seloger":
        return new SelogerWebsite();
      case "jinka":
        return new JinkaWebsite();
      case "pap":
        return new PapWebsite();
      case "logic-immo":
        return new LogicimmoWebsite();
      case "lefigaro":
        return new LefigaroWebsite();
      case "orpi":
        return new OrpiWebsite();
      case "facebook":
        return new FacebookWebsite();
      case "gensdeconfiance":
        return new GensdeconfianceWebsite();
      case "lux-residence":
        return new LuxResidenceWebsite();
      case "bellesdemeures":
        return new BellesDemeuresWebsite();
      default:
        return null;
    }
  }

  isValidPage() {
    return !!this.getId();
  }

  getId() {
    console.error("Not implemented bro");
    return null;
  }

  getData() {
    const body = document.querySelector("html > body");
    return {
      data: JSON.stringify(body.outerHTML),
    };
  }
}
