/**
 * @file
 * Behaviors for the radio element types.
 */
((Drupal, once) => {

  // The webform element types that are managed by this validation library.
  const TYPES = [
    '.webform-type-radios',
    '.webform-type-webform-radios-other',
    '.webform-type-webform-entity-radios',
    '.webform-type-webform-scale',
  ];

  // Revalidation function for an element.
  const revalidate = element => {
    const radios = element.querySelectorAll('input[type="radio"]');

    // Remove any errors that might already be present.
    element.querySelectorAll('.form-type-radios ~ .form-item--error-message').forEach(error => {
      // Unset any aria-describedby relationships.
      radios.forEach(radio => {
        if (radio.hasAttribute('aria-describedby')) {
          const descriptions = radio.getAttribute('aria-describedby').split(' ');
          radio.setAttribute('aria-describedby', descriptions.filter(description => description !== error.id));
        }
      });
      error.remove();
    });

    // If no boxes are checked, add an error.
    if (!element.querySelector('input[type="radio"]:checked')) {
      const error = document.createElement('div');
      error.id = element.id + '-error';
      error.classList.add('form-item--error-message');
      error.textContent = element.getAttribute('data-msg-required');
      element.querySelector('.form-type-radios').after(error);

      // Set up new aria-describedby relationships.
      radios.forEach(radio => {
        const descriptions = radio.hasAttribute('aria-describedby') ? radio.getAttribute('aria-describedby').split(' ') : [];
        descriptions.push(error.id);
        radio.setAttribute('aria-describedby', descriptions.join(' '));
      });
    }
  };

  Drupal.behaviors.psu_webform_radios = {

    /**
     * Applies the inline validation strategy to required radio elements.
     *
     * @type {Drupal~behavior}
     */
    attach: context => {
      const elements = once('psu-webform-radios', TYPES.join(','), context);
      elements.forEach(element => {
        const radios = element.querySelector('.form-type-radios');
        radios.addEventListener('focusout', e => {
          if (element.classList.contains('required') && !e.currentTarget.contains(e.relatedTarget)) {
            revalidate(element);
          }
        });

        element.addEventListener('change', () => {
          if (element.classList.contains('required')) {
            revalidate(element);
          }
        });
      });
    }
  };
})(Drupal, once);
