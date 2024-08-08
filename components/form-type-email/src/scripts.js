/**
 * @file
 * JavaScript behaviors for the email element.
 */

((Drupal, once) => {

  'use strict';

  const reset = element => {

    // Remove the described by attribute.
    element.removeAttribute('aria-describedby');

    // Remove state classes from the input itself.
    element.classList.remove('error', 'warning');

    // Remove any messaging that might be present.
    const messages = element.parentElement.querySelectorAll('.form-item--warning-message, .form-item--error-message');
    messages.forEach(message => message.remove());
  };

  const setWarning = (element, suggestion) => {
    reset(element);

    const warning_id = element.getAttribute('id') + '-warning';

    element.classList.add('warning');

    const suggestion_strong = Object.assign(document.createElement('strong'), {
      innerText: suggestion,
    });
    const suggestion_em = Object.assign(document.createElement('em'), {
      innerHTML: suggestion_strong.outerHTML,
    });

    const visually_hidden = Object.assign(document.createElement('span'), {
      classList: 'visually-hidden',
      innerText: 'email address automatically by using ' + suggestion + ' instead?',
    });

    const fixit = Object.assign(document.createElement('button'), {
      classList: 'email-warning__action cta-block cta-block--xcompact cta-block--hollow-solid',
      type: 'button',
      innerHTML: 'Fix ' + visually_hidden.outerHTML,
    });

    const text = 'We might not be able to deliver email to this address. Did you mean ' + suggestion_em.outerHTML + ' instead?';
    Drupal.announce(text, 'assertive');

    const text_element = Object.assign(document.createElement('span'), {
      classList: 'email-warning__message',
      innerHTML: text,
    });

    const email_warning = Object.assign(document.createElement('div'), {
      classList: 'email-warning',
    });
    email_warning.appendChild(text_element);
    email_warning.appendChild(fixit);

    const warning = Object.assign(document.createElement('div'), {
      classList: 'warning form-item--warning-message',
      id: warning_id,
      role: 'alert',
    });

    warning.appendChild(email_warning);

    element.parentElement.appendChild(warning);
    element.setAttribute('aria-describedby', warning_id);
    fixit.addEventListener('click', () => {
      element.value = suggestion;
      element.focus();
      element.blur();
      Drupal.announce('Your email address has been updated to ' + suggestion, 'assertive');
    });
  };

  const setError = (element, message) => {
    reset(element);
    const error_id = element.getAttribute('id') + '-error';
    element.classList.add('error');
    element.parentElement.appendChild(
      Object.assign(document.createElement('div'), {
        classList: 'error form-item--error-message',
        innerText: message,
        id: error_id,
      })
    );
    element.setAttribute('aria-describedby', error_id);
  };

  const validateEmail = (element) => {

    const value = element.value;
    if (value.length) {
      element.insertAdjacentHTML('afterend', Drupal.theme.ajaxProgressThrobber());

      const controller = new AbortController();
      setTimeout(() => controller.abort(), 2500);
      fetch('/neutrino-api/email-validate?email=' + encodeURIComponent(value), { signal: controller.signal })
        .then(response => {
          if (!response.ok) {
            throw new Error(response.statusText);
          }
          return response.json();
        })
        .then(json => {
          if (json.hasOwnProperty('valid') && json.valid) {
            if (json.hasOwnProperty('typos-fixed') && json['typos-fixed']) {
              setWarning(element, json.email);
            }
            else {
              reset(element);
            }
          }
          else {
            setError(element, element.getAttribute('data-msg-email'));
          }
        })
        .catch(() => {
          reset(element);
        })
        .finally(() => {
          element.parentElement.querySelector('.ajax-progress-throbber').remove();
        });
    }
    else if(element.hasAttribute('required')) {
      setError(element, element.getAttribute('data-msg-required'));
    }
  };

  /**
   * Attach handlers to email element.
   *
   * @type {Drupal~behavior}
   */
  Drupal.behaviors.webformEmail = {
    attach: function (context) {
      once('email-validation', '[type="email"]', context).forEach(element => {

        let old_value = element.value;
        element.addEventListener('focusout', () => {
          if (!old_value.length || old_value !== element.value) {
            validateEmail(element);
            old_value = element.value;
          }
        });

        element.addEventListener('input', () => {
          const warnings = element.parentElement.querySelectorAll('.form-item--warning-message');
          if (warnings.length) {
            reset(element);
          }
        });
      });
    }
  };
})(Drupal, once);
