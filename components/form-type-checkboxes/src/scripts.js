/**
 * @file
 * Behaviors for multi-checkbox element types.
 */
((Drupal, once) => {

  // The webform element types that are managed by this validation library.
  const TYPES = [
    '.webform-type-checkboxes',
    '.webform-type-webform-checkboxes-other',
    '.webform-type-webform-entity-checkboxes',
    '.webform-type-webform-term-checkboxes',
  ];

  // Revalidation function for an element.
  const revalidate = element => {
    element.classList.remove('error');
    const checkboxes = element.querySelectorAll('input[type="checkbox"]');

    // Remove any errors that might already be present.
    element.querySelectorAll('.form-type-checkboxes ~ .form-item--error-message').forEach(error => {
      // Unset any aria-describedby relationships.
      checkboxes.forEach(checkbox => {
        if (checkbox.hasAttribute('aria-describedby')) {
          const descriptions = checkbox.getAttribute('aria-describedby').split(' ');
          checkbox.setAttribute('aria-describedby', descriptions.filter(description => description !== error.id));
        }
      });
      error.remove();
    });
    // If no boxes are checked, add an error.
    if (!element.querySelector('input[type="checkbox"]:checked')) {
      element.classList.add('error');
      const error = document.createElement('div');
      error.id = element.id + '-error';
      error.classList.add('form-item--error-message');
      error.textContent = element.getAttribute('data-msg-required');
      element.querySelector('.form-type-checkboxes').after(error);

      // Set up new aria-describedby relationships.
      checkboxes.forEach(checkbox => {
        const descriptions = checkbox.hasAttribute('aria-describedby') ? checkbox.getAttribute('aria-describedby').split(' ') : [];
        descriptions.push(error.id);
        checkbox.setAttribute('aria-describedby', descriptions.join(' '));
      });
    }
  };

  Drupal.behaviors.psu_webform_checkboxes = {

    /**
     * Applies the inline validation strategy to required multi-checkbox elements.
     *
     * @type {Drupal~behavior}
     */
    attach: context => {

      const elements = once('psu-webform-checkboxes', TYPES.join(','), context);
      elements.forEach(element => {
        const checkboxes = element.querySelector('.form-type-checkboxes');
        // Revalidate errors when focus leaves the entire checkboxes element.
        checkboxes.addEventListener('focusout', e => {
          if (element.classList.contains('required') && !e.currentTarget.contains(e.relatedTarget)) {
            revalidate(element);
          }
        });
        checkboxes.addEventListener('change', () => {
          if (element.classList.contains('required')) {
            revalidate(element);
          }
        });
      });
    }
  };
})(Drupal, once);
