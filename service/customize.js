class CustomizeService {
  cptDescriptionHelper = 1;

  constructor() { }
  
  decorate(currentAd) {
    this.customizeAd(currentAd);
  
    this.addDescriptionHelper(
      "Cliquez sur le badge pour plus d'informations ⤴",
      currentAd.isLegal
    );
  }

  customizeAd(currentAd) {
    const adFlag = document.createElement("div");
    adFlag.classList.add("-flag");
    if (!currentAd.isLegal) {
      adFlag.textContent = "Annonce illégale";
      adFlag.classList.add("-illegal");
    } else {
      adFlag.textContent = "✓";
    }
    document.body.appendChild(adFlag);

    const adDescription = document.createElement("div");
    adDescription.style.display = 'none';
    
    if (!currentAd.isLegal) {
      adDescription.textContent = `Prix supposé : ${currentAd.computedInfo.maxAuthorized.value}€`;
    } else {
      adDescription.textContent = `Plus d'info dans la popup (en haut à droite)`;
    }
    adDescription.classList.add('-flag-description');
    adFlag.appendChild(adDescription);

    dragElement(adFlag);

    let x = 0;
    let y = 0;
    adFlag.addEventListener('mousedown', (event) => {
      x = event.clientX;
      y = event.clientY;
    });

    adFlag.addEventListener('mouseup', (event) => {
      const stillStatic = x === event.clientX && y === event.clientY;
      if (stillStatic) {
        if (adDescription.classList.contains('-open')) {
          adDescription.classList.toggle('-open');
          setTimeout(() => {
            adDescription.style.display = 'none';
          }, 200);
        } else {
          adDescription.style.display = 'block';
          adDescription.classList.toggle('-open');
        }
      }
    });
  }

  addDescriptionHelper(text, isLegal) {
    const descriptionHelper = document.createElement("div");
    descriptionHelper.classList.add("-description-helper");
    descriptionHelper.classList.add("-begin");
    descriptionHelper.classList.add(isLegal ? "-legal" : "-illegal");
    descriptionHelper.textContent = text;
    document.body.appendChild(descriptionHelper);

    setTimeout(() => {
      descriptionHelper.classList.add("-middle");

      if (this.cptDescriptionHelper > 0) {
        descriptionHelper.style.top = `${56 * this.cptDescriptionHelper + 20 * 2}px`;
      }
    
      this.cptDescriptionHelper += 1;
    });
  
    setTimeout(() => {
      descriptionHelper.classList.add("-hide");
      this.cptDescriptionHelper -= 1;
    }, 5000);
  };
}