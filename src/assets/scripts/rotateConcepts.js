const INTERVAL_LENGTH = 3000;

function renderRotatingConcepts() {
  var el = document.getElementById('concept');
  if (!el) return;
  var concepts = JSON.parse(el.getAttribute('data-concepts'));

  function rotate() {
    if (el.matches && el.matches(':hover')) return;
    var concept = concepts[i++ % concepts.length];
    el.innerText = concept.conceptTitlePlural || concept.conceptTitle;
    el.setAttribute('title', concept.conceptDescription);
  }

  function makeSpacer() {
    // create invisible clone using longest concept title to set height
    // this avoids long text from pushing all the remaining text on the page down
    var longest = concepts.sort(function (a, b) {
      return b.conceptTitle.length - a.conceptTitle.length;
    })[0].conceptTitle;
    var original = document.getElementById('concept-para');
    var clone = original.cloneNode(true);
    clone.setAttribute('id', 'concept-para-clone');
    clone.innerText = clone.innerText + longest;
    original.parentNode.insertBefore(clone, original.nextSibling);
  }

  makeSpacer();

  var i = 0;
  setInterval(rotate, INTERVAL_LENGTH);
  rotate();
  el.addEventListener('click', rotate);
}

renderRotatingConcepts();
