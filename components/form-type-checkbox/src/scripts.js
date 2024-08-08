/**
 * @file
 * Behaviors for the checkbox element types.
 */
((Drupal, once) => {

  // Revalidation function for an element.
  const revalidate = element => {
    const checkbox = element.querySelector('.form-checkbox');

    // Remove any errors that might already be present.
    element.querySelectorAll('.form-item--error-message').forEach(error => {

      // Unset any aria-describedby relationships.
      if (checkbox.hasAttribute('aria-describedby')) {
        const descriptions = checkbox.getAttribute('aria-describedby').split(' ');
        checkbox.setAttribute('aria-describedby', descriptions.filter(description => description !== error.id));
      }
      error.remove();
    });

    // If the terms checkbox isn't checked, add an error.
    if (!checkbox.checked) {
      const error = document.createElement('div');
      error.id = checkbox.id + '-error';
      error.classList.add('form-item--error-message');
      error.textContent = checkbox.getAttribute('data-msg-required');
      element.querySelector('.form-type-checkbox__wrapper').after(error);

      // Set up new aria-describedby relationships.
      const descriptions = checkbox.hasAttribute('aria-describedby') ? checkbox.getAttribute('aria-describedby').split(' ') : [];
      descriptions.push(error.id);
      checkbox.setAttribute('aria-describedby', descriptions.join(' '));
    }
  };

  Drupal.behaviors.psu_webform_checkbox = {

    /**
     * Applies the inline validation strategy to required terms of service elements.
     *
     * @type {Drupal~behavior}
     */
    attach: context => {
      const elements = once('psu-webform-checkbox', '.form-type-checkbox:not(.form-type-checkboxes *)', context);
      elements.forEach(element => {
        const checkbox = element.querySelector('.form-checkbox');
        checkbox.addEventListener('change', () => {
          if (checkbox.hasAttribute('required')) {
            revalidate(element);
          }
        });

        element.addEventListener('focusout', e => {
          if (checkbox.hasAttribute('required') && !e.currentTarget.contains(e.relatedTarget)) {
            revalidate(element);
          }
        });
      });
    }
  };
})(Drupal, once);
