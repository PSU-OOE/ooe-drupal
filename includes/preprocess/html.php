<?php

use Drupal\Component\Utility\Xss;
use Drupal\Core\Render\Markup;

/**
 * Adds the proper font stack to the head of every page.
 *
 * @param array $variables
 *   The variables to preprocess.
 */
function _ooe_preprocess_html_add_webfonts(array &$variables) {
  /** @var \Drupal\Core\Extension\ThemeExtensionList $extension_theme_list */
  $extension_theme_list = \Drupal::service('extension.list.theme');

  $webfonts_path = implode(DIRECTORY_SEPARATOR, [
    $extension_theme_list->getPath('ooe'),
    'components',
    'global',
    'webfonts',
  ]);

  if (file_exists($webfonts_path . DIRECTORY_SEPARATOR . 'webfonts.twig')) {
    $variables['page']['#attached']['html_head'][] = [[
      '#type' => 'inline_template',
      '#template' => '{% include "@global/webfonts/webfonts.twig" %}',
      '#context' => [
        'base_directory' =>  $webfonts_path,
      ]
    ], 'webfonts'];
  }
}

/**
 * Adds the sprite component build artifact to the bottom of every page.
 *
 * @param array $variables
 *   The variables to preprocess.
 */
function _ooe_preprocess_html_add_sprites(array &$variables) {
  /** @var \Drupal\Core\Extension\ThemeExtensionList $extension_theme_list */
  $extension_theme_list = \Drupal::service('extension.list.theme');
  $sprites_svg = implode(DIRECTORY_SEPARATOR, [
    $extension_theme_list->getPath('ooe'),
    'components',
    'atoms',
    'sprite',
    'dist',
    'sprites.svg',
  ]);

  if (file_exists($sprites_svg)) {

    // Be sure to sanitize the markup, as it's a third party dependency now.
    $safe_svg_markup = Xss::filter(file_get_contents($sprites_svg), ['svg', 'defs', 'path', 'g', 'circle']);

    $variables['page_bottom'][] = [
      '#type' => 'markup',
      '#markup' => Markup::create($safe_svg_markup),
    ];
  }
}

/**
 * Implements hook_preprocess_html().
 */
function ooe_preprocess_html(array &$variables) {
  _ooe_preprocess_html_add_webfonts($variables);
  _ooe_preprocess_html_add_sprites($variables);
}
