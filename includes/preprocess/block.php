<?php

use Drupal\Component\Utility\Html;

/**
 * Implements hook_preprocess_HOOK() for block.
 */
function ooe_preprocess_block(array &$variables) {
  $variables['attributes']['class'][] = 'block';
  $variables['attributes']['class'][] = Html::getClass('block--' . $variables['base_plugin_id']);
  if (isset($variables['derivative_plugin_id'])) {
    $variables['attributes']['class'][] = Html::getClass('block--' . $variables['base_plugin_id'] . '--' . $variables['derivative_plugin_id']);
  }

  if ($variables['base_plugin_id'] !== 'system_menu_block') {
    unset($variables['attributes']['id']);
  }
}
/**
 * Implements hook_preprocess_HOOK() for block__system_breadcrumb_block.
 */
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
