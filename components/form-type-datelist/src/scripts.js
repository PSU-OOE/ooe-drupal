/**
 * @file
 * JavaScript behavior for the datelist element type.
 */
(function (Drupal, once) {

  Drupal.behaviors.psu_datelist = {

    /**
     * Applies the inline validation strategy to required datelist elements.
     *
     * @type {Drupal~behavior}
     */
    attach: function attach(context) {
      const elements = once('psu-webform-datelist', '.form-type-datelist', context);
      elements.forEach(element => {

        // Revalidate errors when focus leaves the entire datelist element.
        element.addEventListener('focusout', e => {
          const target = e.currentTarget;
          if (target.querySelector(':required') && !element.contains(e.relatedTarget)) {
            const parts = element.querySelectorAll('select');
            parts.forEach(part => part.classList.remove('error'));

            const errors = element.querySelectorAll('.form-item--error-message');
            errors.forEach(error => {
              parts.forEach(part => {
                if (part.hasAttribute('aria-describedby')) {
                  const descriptions = part.getAttribute('aria-describedby').split(' ');
                  part.setAttribute('aria-describedby', descriptions.filter(description => description !== error.id));
                }
              });
              error.remove();
            });

            const empty_parts = Array.from(parts).filter(part => part.value === '');
            if (empty_parts.length) {
              empty_parts.forEach(part => part.classList.add('error'));
              const error = document.createElement('div');
              const inline_container = element.querySelector('.container-inline');
              error.id = inline_container.id + '-error';
              error.classList.add('form-item--error-message');

              if (empty_parts.length === parts.length) {
                if (parts[0].hasAttribute('data-webform-required-error')) {
                  error.textContent = parts[0].getAttribute('data-webform-required-error');
                }
                else {
                  error.innerHTML = Drupal.t('The %label date is required.', {'%label': element.querySelector('label').textContent});
                }
              }
              else {
                error.textContent = 'The ' + element.querySelector('label').textContent + ' date is incomplete.';
              }

              inline_container.after(error);

              // Set up new aria-describedby relationships.
              parts.forEach(part => {
                const descriptions = part.hasAttribute('aria-describedby') ? part.getAttribute('aria-describedby').split(' ') : [];
                descriptions.push(error.id);
                part.setAttribute('aria-describedby', descriptions.join(' '));
              });
            }
          }
        });
      });
    }
  };
})(Drupal, once);
