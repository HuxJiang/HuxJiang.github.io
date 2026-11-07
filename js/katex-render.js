(function () {
  if (typeof katex === 'undefined') return;
  document.querySelectorAll('.math-block, .math-inline').forEach(function (el) {
    var latex = el.getAttribute('data-latex');
    var display = el.classList.contains('math-block');
    if (!latex) return;
    try {
      katex.render(latex, el, { displayMode: display, throwOnError: false });
    } catch (e) {}
  });
})();
