/**
 * @file
 * JavaScript behaviors for the footer menu.
 */
(function (cms) {

  cms.attach('footerTop', context => {
    const menu = context.querySelector('.footer-top nav');

    if (!menu) {
      return;
    }

    const toggles = menu.querySelectorAll('.toggle-submenu');
    toggles.forEach(toggle => {
      toggle.addEventListener('click', () => {
        const target = toggle.nextElementSibling;
        const old_state = toggle.getAttribute('aria-expanded') === 'true';
        if (old_state) {
          cms.collapse(target);
          toggle.setAttribute('aria-expanded', 'false');
        }
        else {
          cms.expand(target);
          toggle.setAttribute('aria-expanded', 'true');
        }
      });
    });
  });
})(cms);
