/**
 * @file
 *   Hijacks part of the File subsystem scripting to normalize error placement with the IFE module.
 */
((Drupal, once) => {
  Drupal.file = Drupal.file || {};
  Drupal.file.validateExtension = function(event) {
    event.preventDefault();
    const file_input = event.target;
    const wrapper = file_input.closest('[id^="ajax-wrapper"]');

    // Remove any existing alerts.
    wrapper.querySelectorAll('.alert').forEach(alert => {
      if (file_input.hasAttribute('aria-describedby')) {
        const descriptions = file_input.getAttribute('aria-describedby').split(' ');
        file_input.setAttribute('aria-describedby', descriptions.filter(description => description !== alert.getAttribute('id')));
      }
      alert.remove();
    });

    // Add client side validation for the input[type=file].
    const extensionPattern = event.data.extensions.replace(/,\s*/g, '|');
    if (extensionPattern.length > 1 && this.value.length > 0) {
      const acceptableMatch = new RegExp(`\\.(${extensionPattern})$`, 'gi');
      if (!acceptableMatch.test(this.value)) {
        const error = Drupal.t(
          'The selected file %filename cannot be uploaded. Only files with the following extensions are allowed: %extensions.',
          {
            // According to the specifications of HTML5, a file upload control
            // should not reveal the real local path to the file that a user
            // has selected. Some web browsers implement this restriction by
            // replacing the local path with "C:\fakepath\", which can cause
            // confusion by leaving the user thinking perhaps Drupal could not
            // find the file because it messed up the file path. To avoid this
            // confusion, therefore, we strip out the bogus fakepath string.
            '%filename': this.value.replace('C:\\fakepath\\', ''),
            '%extensions': extensionPattern.replace(/\|/g, ', '),
          },
        );

        const error_id = file_input.getAttribute('id') + '-error';
        wrapper.prepend(Drupal.theme.message({text: error}, {type: 'error', id: error_id}));

        // Set up the appropriate aria-describedby relationships.
        const descriptions = file_input.hasAttribute('aria-describedby') ? file_input.getAttribute('aria-describedby').split(' ') : [];
        descriptions.push(error_id);
        file_input.setAttribute('aria-describedby', descriptions.join(' '));

        // Announce the error to A/T.
        Drupal.announce(error, 'assertive');

        this.value = '';
        // Cancel all other change event handlers.
        event.stopImmediatePropagation();
      }
    }
  };

  Drupal.behaviors.psu_managed_file = {
    attach: context => {
      const elements = once('psu-managed-file', '.form-type-managed-file:has(input[type="file"])', context);
      elements.forEach(element => {
        const file_input = element.querySelector('input[type="file"]');

        // If the file input changes, remove any required messaging.
        file_input.addEventListener('change', () => {
          element.querySelectorAll('.form-item--error-message').forEach(error => {
            if (file_input.hasAttribute('aria-describedby')) {
              const descriptions = file_input.getAttribute('aria-describedby').split(' ');
              file_input.setAttribute('aria-describedby', descriptions.filter(description => description !== error.getAttribute('id')));
            }
            error.remove();
          });
        });
        file_input.addEventListener('blur', () => {

          // Only consider adding an error if one isn't already present.
          if (element.querySelectorAll('.form-item--error-message').length === 0) {

            // Add an error only if the element is both required and empty.
            if (file_input.hasAttribute('required') && file_input.files.length === 0) {
              file_input.classList.add('error');

              const error = document.createElement('div');
              error.id = file_input.id + '-inline-error';
              error.classList.add('form-item--error-message');
              if (file_input.hasAttribute('data-required-msg')) {
                error.textContent = file_input.getAttribute('data-msg-required');
              }
              else {
                const label = document.querySelector('label[for="' + file_input.id + '"]').textContent;
                error.textContent = label + ' field is required';
              }

              // Set up new aria-describedby relationships.
              const descriptions = file_input.hasAttribute('aria-describedby') ? file_input.getAttribute('aria-describedby').split(' ') : [];
              descriptions.push(error.id);
              file_input.setAttribute('aria-describedby', descriptions.join(' '));

              file_input.after(error);

            }
          }
        });
      });
    },
  };
})(Drupal, once);
