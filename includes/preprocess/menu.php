<?php

/**
 * Implements hook_theme_suggestions_HOOK_alter().
 */
function ooe_theme_suggestions_menu_alter(&$suggestions, array $variables) {
  if (isset($variables['attributes']['region'])) {
    $suggestion = 'menu__' . $variables['menu_name'] . '__' . $variables['attributes']['region'];
    $suggestion = str_replace('-', '_', $suggestion);
    $suggestions[] = $suggestion;
  }
}