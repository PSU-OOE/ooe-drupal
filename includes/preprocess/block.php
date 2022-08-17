<?php

use Drupal\Component\Utility\Html;

/**
 * Implements hook_preprocess_HOOK() for block.
 */
function ooe_preprocess_block(array &$variables) {
  $variables['attributes']['class'][] = 'block';
  $variables['attributes']['class'][] = Html::getClass('block--' . $variables['plugin_id']);

  if ($variables['base_plugin_id'] !== 'system_menu_block') {
    unset($variables['attributes']['id']);
  }
}

function ooe_preprocess_block__system_breadcrumb_block(array &$variables) {
  $links = [];
  foreach ($variables['content']['#links'] as $link) {
    /** @var \Drupal\Core\Link $link */
    $link = $link->toRenderable();
    $link['#attributes']['class'][] = 'breadcrumbs__link';
    $links[] = $link;
  }
  $variables['links'] = $links;
}
