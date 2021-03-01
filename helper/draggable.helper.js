const dragElement = (elmnt) => {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  const listener = elmnt.addEventListener('mousedown', dragMouseDown);

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();

    if (e.button === 0) {
      // get the mouse cursor position at startup:
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.addEventListener('mouseup', closeDragElement);
      // call a function whenever the cursor moves:
      document.addEventListener('mousemove', elementDrag);
    }
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    if ((elmnt.offsetTop - pos2) > 10 && (elmnt.offsetTop - pos2) < document.documentElement.clientHeight - 70) {
      elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    }

    if ((elmnt.offsetLeft - pos1) > 300 && (elmnt.offsetLeft - pos1) < document.documentElement.clientWidth - 70) {
      elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.removeEventListener('mouseup', closeDragElement);
    document.removeEventListener('mousemove', elementDrag);
  }

  return listener;
}