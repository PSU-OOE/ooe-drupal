/**
 * @file
 * JavaScript behaviors for terms of service element integration.
 */

((Drupal, once) => {

  'use strict';

  /**
   * Display terms of service in the design system modal dialog.
   *
   * @type {Drupal~behavior}
   */
  Drupal.behaviors.webformTermsOfService = {
    attach: context => {
      const elements = once('webform-terms-of-service', '.form-type-webform-terms-of-service', context);
      elements.forEach(element => {
        const trigger = element.querySelector('label a');
        trigger.addEventListener('click', e => {
          e.preventDefault();
          const modal = element.querySelector('.modal');
          modal.dispatchEvent(new CustomEvent('component:activate', {
            detail: {
              modal_trigger: trigger,
            }
          }));
        });
      });
    }
  };

})(Drupal, once);
