(Drupal => {

  const sprite_map = {
    error: 'fa-exclamation-triangle',
    warning: 'fa-exclamation-circle',
    status: 'fa-check-circle'
  };

  const viewbox_map = {
    error: '0 0 576 512',
    warning: '0 0 512 512',
    status: '0 0 512 512',
  };

  /**
   * Theme function for a message.
   *
   * @param {object} message
   *   The message object.
   * @param {string} message.text
   *   The message text.
   * @param {object} options
   *   The message context.
   * @param {string} options.type
   *   The message type.
   * @param {string} options.id
   *   ID of the message, for reference.
   *
   * @return {HTMLElement}
   *   A DOM Node.
   */
  Drupal.theme.message = ({ text }, { type, id }) => {
    const message = document.createElement('div');
    message.classList.add('messages');
    message.innerHTML = `
      <div class="alert alert--${type}" data-light id="${id}">
        <div class="alert__inner-wrapper">
          <div class="alert__icon">
            <svg class="sprite sprite--${sprite_map[type]}" aria-hidden="true" viewBox="${viewbox_map[type]}">
              <use xlink:href="#${sprite_map[type]}"></use>
            </svg>
          </div>
          <div class="alert__content">
            ${text}
          </div>
        </div>
      </div>
    `;
    return message;
  };
})(Drupal);
