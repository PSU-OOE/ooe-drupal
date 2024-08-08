/**
 * @file
 * Attaches client-side validation behaviors for the psu_webform module.
 *
 * @see https://jqueryvalidation.org/
 */
(function (Drupal, once, $) {

  // Run validation on select2 elements on change.
  Drupal.behaviors.select2_clientside_validation = {
    attach: context => {
      const elements = once('select2-clientside-validation', '.webform-select2', context);
      elements.forEach(element => {
        $(element).on('change select2:close select2:clear', function() {
          $(this).valid();
        });
      });
    }
  };

  $(document).on('cv-jquery-validate-options-update', function (event, options) {

    /**
     * Is the element supported by the default validation mechanism?
     * @param $element
     *   The element to check support for.
     * @returns {boolean}
     */
    function isElementSupported($element) {
      let supported = true;

      if ($element.attr('type') === 'file') {
        supported = false;
      }

      // Email address fields use Neutrino validation.
      if ($element.attr('type') === 'email') {
        supported = false;
      }

      // Radios and checkbox groups need specialized treatment.
      if ($element.attr('type') === 'radio' || $element.attr('type') === 'checkbox' ) {
        supported = false;
      }
      // Datelist elements are not supported.
      else if($element.parents('.js-form-type-datelist').length) {
        supported = false;
      }
      return supported;
    }

    // Fires when an error is being placed on an element.
    options.errorPlacement = function(new_error, $element) {
      new_error.addClass('form-item--error-message');
      $element.parent().parent().find('.form-item--error-message').remove();

      if ($element.hasClass('webform-select2')) {
        $element.parent().parent().append(new_error);
      }
      else {
        $element.after(new_error);
      }
    };

    options.highlight = function(element, errorClass) {
      element.classList.add(errorClass);
      if (element.classList.contains('webform-select2')) {
        $(element).parent().find('.select2-container').addClass(errorClass);
      }
    };

    // Fires when the validation library wants to remove a highlight.
    options.unhighlight = function(element, errorClass, validClass) {

      // Remove all error element(s).
      const form_item = element.closest('.form-item');
      if (form_item) {
        form_item.querySelectorAll('.form-item--error-message').forEach(error => error.remove());
      }

      // Toggle error classing.
      element.classList.remove(errorClass);
      element.classList.add(validClass);

      if (element.classList.contains('webform-select2')) {
        const select2 = element.parentElement.querySelector('.select2-container');
        select2.classList.remove(errorClass);
        select2.classList.add(validClass);
      }
    };

    options.onfocusout = function(element) {
      const $element = $(element);
      if (isElementSupported($element)) {
        this.element(element);
      }
    };

    options.onsubmit = false;
    options.onkeyup = false;
    options.errorClass = 'error';
    options.errorElement = 'div';

    $.each(['form-text','form-textarea','form-tel'], function(key, class_name) {
      $.validator.addClassRules(class_name, {
        normalizer: function(value) {
          return $.trim(value);
        }
      });
    });


    $('form').each(function() {
      // By calling validate here ourselves, we beat the contrib to the punch.
      // This allows us to have full control over ALL configuration.
      $(this).validate(options);
    });
  });


})(Drupal, once, jQuery);
