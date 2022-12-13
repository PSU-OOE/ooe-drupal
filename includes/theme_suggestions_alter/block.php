<?php

/**
 * Implements hook_theme_suggestions_HOOK_alter().
 */
function ooe_theme_suggestions_block_alter(array &$suggestions, array $variables) {
  if ($variables['elements']['#base_plugin_id'] === 'block_content') {
    /** @var \Drupal\block_content\BlockContentInterface $block */
    $block = $variables['elements']['content']['#block_content'];
    $suggestions[] = 'block__' . $block->bundle();
  }
}