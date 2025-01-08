/**
 * @file
 * Replaced Drupal cores ajax throbber(s), see: https://www.drupal.org/node/2974681
 * Append the throbber indicator to be inside the button element.
 *
 */
(($, Drupal, drupalSettings) => {

  Drupal.theme.ajaxProgressThrobber = () => `<span class="ajax-progress-throbber">${drupalSettings.ooe.spinner_component}</span>`;

  Drupal.Ajax.prototype.setProgressIndicatorThrobber = function() {
    this.progress.element = $(Drupal.theme('ajaxProgressThrobber'));
    $(this.element).find(".button__icon").append(this.progress.element);
  };

})(jQuery, Drupal, drupalSettings);
