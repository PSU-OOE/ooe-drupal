<?php

/**
 * Implements hook_preprocess_HOOK().
 */
function ooe_preprocess_off_canvas_page_wrapper(&$variables) {
  $variables['#cache']['contexts'][] = 'user.roles';

  if (count(\Drupal::currentUser()->getRoles()) > 1) {
    $variables['render_off_canvas_page_wrapper'] = TRUE;
  }
}
