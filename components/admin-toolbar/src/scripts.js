/**
 * @file
 * Adds a callback to the global scroll-offset callbacks array.
 *
 * This callback compensates for the presence of the admin toolbar and is
 * only loaded when a user is authenticated.
 */
(function (Drupal, once) {

  'use strict';

  Drupal.behaviors.ooeAdminToolbar = {
    attach: context => {
      if (context === document) {
        Drupal.ooe = Drupal.ooe || {};
        Drupal.ooe.scrollOffsetCallbacks = Drupal.ooe.scrollOffsetCallbacks || [];

        Drupal.ooe.scrollOffsetCallbacks.push(() => {
          let height = 0;
          if (window.innerWidth < 976) {
            const toolbar = document.querySelector('.toolbar-bar');
            if (toolbar) {
              height += toolbar.offsetHeight;
            }
          }
          else {
            const secondary_toolbar = document.querySelector('.gin-secondary-toolbar');
            if (secondary_toolbar) {
              height += secondary_toolbar.offsetHeight;
            }
          }
          return height;
        });
      }
    }
  };
})(Drupal, once);
