<?php

use Drupal\Component\Utility\Xss;
use Drupal\Core\Render\Markup;

function _ooe_preprocess_html_add_cms_binding(array &$variables) {
  $variables['page']['#attached']['html_head'][] = [[
    '#type' => 'html_tag',
    '#tag' => 'script',
    '#value' => Markup::create(<<<SCRIPT
        const cms = {
          vendor_dir: '/themes/custom/worldcampus/upstream-components/vendor',
          announce: (text, priority) => {
            if (typeof Drupal !== 'undefined' && typeof Drupal.announce !== 'undefined') {
              Drupal.announce(text, priority);
            }
          },
          data: name => {
            if (typeof drupalSettings !== 'undefined' && drupalSettings.exposed_data !== 'undefined') {
              return drupalSettings.exposed_data[name];
            }
          },
          attach: (component, callback) => {
            if (typeof Drupal !== 'undefined' && typeof Drupal.behaviors !== 'undefined') {
              Drupal.behaviors[component] = Drupal.behaviors[component] || {};
              Drupal.behaviors[component].attach = callback;
            }
          },
          detach: (component, callback) => {
            if (typeof Drupal !== 'undefined' && typeof Drupal.behaviors !== 'undefined') {
              Drupal.behaviors[component] = Drupal.behaviors[component] || {};
              Drupal.behaviors[component].detach = callback;
            }
          }
        };
    SCRIPT)
  ], 'cms-binding'];
}

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
    'node_modules',
    '@psu-ooe',
    'webfonts',
    'webfonts'
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
    'node_modules',
    '@psu-ooe',
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
  _ooe_preprocess_html_add_cms_binding($variables);
  _ooe_preprocess_html_add_webfonts($variables);
  _ooe_preprocess_html_add_sprites($variables);
}
