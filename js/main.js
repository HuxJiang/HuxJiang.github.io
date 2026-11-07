(function () {
  var toggles = document.querySelectorAll('.note-group-toggle');
  toggles.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var group = btn.closest('.note-group');
      var isExpanded = btn.getAttribute('aria-expanded') === 'true';
      if (isExpanded) {
        btn.setAttribute('aria-expanded', 'false');
        group.classList.add('collapsed');
      } else {
        btn.setAttribute('aria-expanded', 'true');
        group.classList.remove('collapsed');
      }
    });
  });

  var themeToggle = document.querySelector('.theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      var next = isDark ? 'light' : 'dark';
      if (next === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.removeAttribute('data-theme');
      }
      try { localStorage.setItem('theme', next); } catch (e) {}
    });
  }

  var navToggle = document.querySelector('.nav-toggle');
  var siteNav = document.getElementById('site-nav');
  if (navToggle && siteNav) {
    navToggle.addEventListener('click', function () {
      var open = siteNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    siteNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        siteNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }
})();

(function () {
  var content = document.querySelector('.content');
  if (!content) return;

  function headingLevel(el) {
    return parseInt(el.tagName.substring(1), 10);
  }
  function isHeading(el) {
    return el && /^H[1-6]$/.test(el.tagName);
  }

  var headings = content.querySelectorAll('h1, h2, h3, h4, h5, h6');

  headings.forEach(function (heading) {
    if (heading.classList.contains('heading-collapsible')) return;

    var level = headingLevel(heading);

    // 标题级别指示标（显示是几级标题）
    var levelBadge = document.createElement('span');
    levelBadge.className = 'heading-level';
    levelBadge.textContent = String(level);
    heading.appendChild(levelBadge);

    // 收集该标题到下一个同级或更高级标题之间的内容
    var body = document.createElement('div');
    body.className = 'heading-body';
    var next = heading.nextElementSibling;
    while (next && !(isHeading(next) && headingLevel(next) <= level)) {
      var current = next;
      next = next.nextElementSibling;
      body.appendChild(current);
    }

    var hasBody = body.childNodes.length > 0;
    heading.classList.add('heading-collapsible');

    // 无下级内容的标题：保留分隔线与级别标，不做折叠交互
    if (!hasBody) {
      heading.classList.add('heading-empty');
      return;
    }

    heading.parentNode.insertBefore(body, heading.nextSibling);
    heading.setAttribute('role', 'button');
    heading.setAttribute('tabindex', '0');
    heading.setAttribute('aria-expanded', 'true');

    var caret = document.createElement('span');
    caret.className = 'heading-caret';
    caret.setAttribute('aria-hidden', 'true');
    heading.insertBefore(caret, heading.firstChild);

    function toggle() {
      var collapsed = heading.classList.toggle('collapsed');
      heading.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
    }

    heading.addEventListener('click', toggle);
    heading.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        toggle();
      }
    });
  });
})();
