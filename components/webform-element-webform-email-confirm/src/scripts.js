((Drupal, once) => {

  'use strict';

  const add_error = (element, email, confirm) => {
    if (!element.querySelector('.fieldset-wrapper > .form-item--error-message')) {
      const error = document.createElement('div');
      error.id = element.id + '-error';
      error.classList.add('form-item--error-message');
      error.textContent = confirm.getAttribute('data-msg-equalto') ?? 'The specified email addresses do not match.';
      element.querySelector('.fieldset-wrapper').appendChild(error);

      // Set up new aria-describedby relationships.
      [email, confirm].forEach(email_input => {
        const descriptions = email_input.hasAttribute('aria-describedby') ? email_input.getAttribute('aria-describedby').split(' ') : [];
        descriptions.push(error.id);
        email_input.setAttribute('aria-describedby', descriptions.join(' '));
      });
    }
  };

  const remove_error = (element, email, confirm) => {
    const error = element.querySelector('.fieldset-wrapper > .form-item--error-message');
    if (error) {
      [email, confirm].forEach(email_input => {
        if (email_input.hasAttribute('aria-describedby')) {
          const descriptions = email_input.getAttribute('aria-describedby').split(' ');
          email_input.setAttribute('aria-describedby', descriptions.filter(description => description !== error.id));
        }
      });
      error.remove();
    }
  };

  /**
   * Attach handlers to email element.
   *
   * @type {Drupal~behavior}
   */
  Drupal.behaviors.webformEmailConfirm = {
    attach: context => {
      const elements = once('webform-email-confirm', '.webform-type-webform-email-confirm', context);
      elements.forEach(element => {

        const email = element.querySelector('.webform-email');
        const confirm = element.querySelector('.webform-email-confirm');

        // When focus leaves the composite element, if the email addresses
        // don't match, add the "emails must match" error.
        element.addEventListener('focusout', e => {
          if (!e.currentTarget.contains(e.relatedTarget)) {
            if (email.value !== confirm.value) {
              add_error(element, email, confirm);
            }
            else {
              remove_error(element, email, confirm);
            }
          }
        });

        // When one of the email inputs change, there's an existing "emails
        // must match" error message present, and now both emails are equal,
        // we remove the error and adjust the aria-describedby attributes.
        element.addEventListener('change', () => {
          if (email.value === confirm.value) {
            remove_error(element, email, confirm);
          }
        });
      });
    }
  };

})(Drupal, once);
