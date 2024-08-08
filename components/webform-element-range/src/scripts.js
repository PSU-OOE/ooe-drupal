/**
 * @file
 * JavaScript behaviors for range element integration.
 */

((Drupal, once) => {

  'use strict';

  /**
   * Display HTML5 range output in a left/right aligned number input.
   *
   * @type {Drupal~behavior}
   */
  Drupal.behaviors.webformRangeOutputNumber = {
    attach: context => {
      once('webform-range-output-number', '.js-form-type-range', context).forEach(range => {

        const input = range.querySelector('input[type="range"]');
        const output = range.querySelector('input[type="number"]');
        if (input && output) {
          input.addEventListener('input', () => {
            output.value = input.value;
          });

          output.addEventListener('input', () => {
            input.value = output.value;
          });

          output.value = input.value;
        }
      });
    },
  };

  Drupal.behaviors.webformRangeOutputBubble = {
    attach: context => {
      once('webform-range-output-bubble', '.js-form-type-range', context).forEach(range => {
        const input = range.querySelector('input[type="range"]');
        const output = range.querySelector('output');

        if (input && output) {
          const listener = () => {

            // Update the output element's value.
            output.innerHTML = '<span>' + input.value + '</span>';

            // Revalidate the position of the floating output bubble.
            const min = input.getAttribute('min');
            const max = input.getAttribute('max');
            const offset = ((input.value - min) * 100) / (max - min);

            // We have to correct the position by a factor equivalent to half
            // of the thumb width minus the offset % multiplied by a tenth of
            // the thumb width.  There be dragons, they be slain.
            const correction = 14 - offset * 0.28;

            output.style.left = `calc(${offset}% + ${correction}px)`;
          };

          input.addEventListener('input', listener);

          // Invoke the listener once to populate the output on page load.
          listener();
        }
      });
    }
  };
})(Drupal, once);
