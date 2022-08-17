<?php

use Drupal\Component\Utility\Html;

/**
 * Implements hook_preprocess_HOOK() for block.
 */
function ooe_preprocess_region(&$variables) {
  $variables['attributes']['class'][] = 'region';
  $variables['attributes']['class'][] = Html::getClass('region--' . $variables['region']);
}
