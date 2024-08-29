/**
 * @file
 */
((Drupal, once) => {

  'use strict';
  Drupal.ooe = Drupal.ooe || {};
  Drupal.ooe.scrollOffsetCallbacks = Drupal.ooe.scrollOffsetCallbacks || [];

  /**
   * Calculates the total height to compensate for when scrolling.
   */
  Drupal.ooe.revalidateScrollOffset = function(additional) {
    // Add up the sum of all the callbacks.
    const callbacks = Drupal.ooe.scrollOffsetCallbacks;
    const base = callbacks.reduce(
      function(total, callback) {
        return total + callback();
      }, 10
    );
    // These objects will exist if an ajax-enabled webform is present.  The
    // scrollTopOffset property is referenced by internal Webform scripting
    // logic to determine the offset to scroll to between pages if the top
    // of the form is outside the viewport.
    if (Drupal.webform && Drupal.webform.ajax) {
      let offset = parseInt(base, 10);
      // Add 40px for padding on the form.
      offset += 40;
      Drupal.webform.scrollTopOffset = offset;
      Drupal.webform.ajax.scrollTopOffset = offset;
    }
    document.documentElement.style['scrollPaddingTop'] = parseInt(base + (additional ? additional : 0), 10) + 'px';
  };

  /**
   * Sets up anchor link click listeners for same page links.
   *
   * @type {Drupal~behavior}
   *
   * @prop {Drupal~behaviorAttach} attach
   *   Attaches the behavior to the current context.
   */
  Drupal.behaviors.globalSmoothScroll = {
    attach: context => {
      const jump_links = once('smooth-scroll', 'a[href*="#"]', context);
      jump_links.forEach(jump_link => {
        jump_link.addEventListener('click', () => {
          let additional = 0;
          const scroll_offset = parseInt(jump_link.getAttribute('data-scroll-offset'), 10);
          if (Number.isInteger(scroll_offset)) {
            additional += scroll_offset;
          }
          Drupal.ooe.revalidateScrollOffset(additional);
        });
      });

      // Only try to calculate things after all JS has had a chance to run.
      setTimeout(function() {
        Drupal.ooe.revalidateScrollOffset();
      }, 1);
    }
  };
})(Drupal, once);

