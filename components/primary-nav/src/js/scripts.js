/**
 * @file
 * JavaScript behaviors for the sticky menu.
 */
(function (cms) {

  let timeout = false;

  const slideToggle = function (toggle, forceClose) {
    const el = toggle.nextElementSibling;
    if (!forceClose && toggle.getAttribute('aria-expanded') === 'false') {
      el.classList.add('active');
      el.style.height = 'auto';

      let height = el.clientHeight + "px";

      el.style.height = '0px';

      setTimeout(function () {
        el.style.height = height;
      }, 0);
      toggle.setAttribute('aria-expanded', 'true');
    } else {
      el.style.height = '0px';

      el.classList.remove('active');

      toggle.setAttribute('aria-expanded', 'false');
    }
  };

  cms.attach('primaryNav', context => {
    const menu = context.querySelector('.block--primary-nav');

    if (!menu) {
      return;
    }

    const mobile_toggle = menu.querySelector('.primary-nav__mobile-toggle');
    const submenus = menu.querySelectorAll('.menu__item--has-children');
    const submenu_toggles = menu.querySelectorAll('.menu__toggle');

    // Add a focusout listener to the menu itself that:
    // 1) Toggles the 'aria-expanded' property on its main toggle button
    // 2) Toggles the 'nav-expanded' class on the <body> element
    // 3) Turns 'aria-expanded' off for all child buttons when closed
    menu.addEventListener('focusout', function() {
      if (!menu.contains(event.relatedTarget)) {
        menu.querySelector('.primary-nav__mobile-toggle').setAttribute('aria-expanded', 'false');
        document.documentElement.classList.remove('nav-expanded');
        menu.querySelectorAll('.menu__toggle').forEach(toggle => {
          if (!toggle.previousElementSibling.classList.contains('menu__link--always-expanded')) {
            slideToggle(toggle, true);
          }
        });
      }
    });

    // Add a keydown listener to the menu that:
    // 1) Turns 'aria-expanded' off for the main toggle button
    // 2) Turns 'aria-expanded' off for all child buttons when closed
    // 3) Moves focus back to the mobile toggle element.
    menu.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        menu.querySelector('.primary-nav__mobile-toggle').setAttribute('aria-expanded', 'false');
        document.documentElement.classList.remove('nav-expanded');
        menu.querySelectorAll('.menu__toggle').forEach(toggle => {
          if (!toggle.previousElementSibling.classList.contains('menu__link--always-expanded')) {
            slideToggle(toggle, true);
          }
        });
        menu.querySelector('.primary-nav__mobile-toggle').focus();
      }
    });

    // Add a click listener to the mobile toggle element that:
    // 1) Toggles the 'aria-expanded' property on itself
    // 2) Toggles the 'nav-expanded' class on the <body> element
    // 3) Turns 'aria-expanded' off for all child buttons when closed
    mobile_toggle.addEventListener('click', () => {
      const current_state = mobile_toggle.getAttribute('aria-expanded');
      const new_state = (current_state === 'true' ? 'false' : 'true');
      if (new_state) {
        document.documentElement.classList.add('nav-expanded');
        if (timeout !== false) {
          clearTimeout(timeout);
          timeout = false;
        }
      }
      else {
        timeout = setTimeout(() => {
          document.documentElement.classList.remove('nav-expanded');
          context.querySelectorAll('.menu__toggle').forEach(toggle => {
            toggle.setAttribute('aria-expanded', 'false');
          });
        }, 200);
      }
      mobile_toggle.setAttribute('aria-expanded', new_state);
    });

    // Add a click listener to each submenu toggle that simply toggles its
    // aria-expanded attribute.
    submenu_toggles.forEach(toggle => {
      toggle.addEventListener('click', () => slideToggle(toggle));
    });

    // Add "desktop-only" events to the menu.
    submenus.forEach(submenu => {
      const button = submenu.querySelector('.menu__toggle');

      // Turn on 'aria-expanded' on hover.
      submenu.addEventListener('mouseenter', () => {
        if (Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0) >= 1024) {
          button.setAttribute('aria-expanded', 'true');
        }
      });

      // Turn off 'aria-expanded' on leave.
      submenu.addEventListener('mouseleave', () => {
        if (Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0) >= 1024) {
          button.setAttribute('aria-expanded', 'false');
        }
      });

      // Turn off 'aria-expanded' on focusout.
      submenu.addEventListener('focusout', () => {
        if (Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0) >= 1024) {
          if (!submenu.contains(event.relatedTarget)) {
            submenu.querySelector('.menu__toggle').setAttribute('aria-expanded', 'false');
          }
        }
      });
    });

    menu.classList.add('primary-nav--initialized');
  });
})(cms);
