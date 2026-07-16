/* Momemade theme JS — kept intentionally light. */
(function () {
  // Close the mobile menu when a link inside it is clicked.
  document.querySelectorAll('.header__mobile-menu').forEach(function (details) {
    details.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        details.removeAttribute('open');
      });
    });

    // Close on click outside.
    document.addEventListener('click', function (event) {
      if (details.hasAttribute('open') && !details.contains(event.target)) {
        details.removeAttribute('open');
      }
    });
  });

  // Keep the cart count bubble fresh after AJAX-ish navigations (bfcache).
  window.addEventListener('pageshow', function (event) {
    if (!event.persisted) return;
    fetch('/cart.js')
      .then(function (res) { return res.json(); })
      .then(function (cart) {
        document.querySelectorAll('[data-cart-count]').forEach(function (el) {
          el.textContent = cart.item_count;
          el.classList.toggle('is-empty', cart.item_count === 0);
        });
      })
      .catch(function () {});
  });
})();
