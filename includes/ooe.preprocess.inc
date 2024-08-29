<?php

/**
 * @file
 * Generic preprocess hooks for the world campus theme.
 */

use Drupal\Component\Utility\Html;
use Drupal\Component\Utility\Xss;
use Drupal\Core\Render\Element;
use Drupal\Core\Render\Markup;
use Drupal\Core\StringTranslation\TranslatableMarkup;
use Drupal\webform\Entity\Webform;

/**
 * Adds the requisite CMS binding javascript to <head>.
 *
 * @param array $variables
 *   The variables being preprocessed.
 */
function _ooe_preprocess_html_add_cms_binding(array &$variables): void {
  $variables['page']['#attached']['html_head'][] = [[
    '#type' => 'html_tag',
    '#tag' => 'script',
    '#value' => Markup::create(<<<SCRIPT
        const cms = new Proxy({
          announce (text, priority) {
            if (typeof Drupal !== 'undefined' && typeof Drupal.announce !== 'undefined') {
              Drupal.announce(text, priority);
            }
          },
          data(name) {
            if (typeof drupalSettings !== 'undefined' && drupalSettings.exposed_data !== 'undefined') {
              return drupalSettings.exposed_data[name];
            }
          },
          attach(component, callback) {
            if (typeof Drupal !== 'undefined' && typeof Drupal.behaviors !== 'undefined') {
              Drupal.behaviors[component] = Drupal.behaviors[component] || {};
              Drupal.behaviors[component].attach = callback;
            }
          },
          detach(component, callback) {
            if (typeof Drupal !== 'undefined' && typeof Drupal.behaviors !== 'undefined') {
              Drupal.behaviors[component] = Drupal.behaviors[component] || {};
              Drupal.behaviors[component].detach = callback;
            }
          },
          once: (id, selector, context = document) => once(id, selector, context)
        }, {
          get(target, prop) {
            if (prop === 'gtm_container_id') {
              return drupalSettings?.gtm?.tagIds[0] ?? 'GTM-K8NQZW';
            }
            return Reflect.get(...arguments);
          },
        });
    SCRIPT),
  ], 'cms-binding',
  ];
}

/**
 * Adds the proper font stack to the head of every page.
 *
 * @param array $variables
 *   The variables to preprocess.
 */
function _ooe_preprocess_html_add_webfonts(array &$variables): void {
  $variables['page']['#attached']['html_head'][] = [
    [
      '#type' => 'inline_template',
      '#template' => '{% include "@psu-ooe/webfonts/webfonts.twig" %}',
    ], 'webfonts',
  ];
}

/**
 * Adds the sprite component build artifact to the bottom of every page.
 *
 * @param array $variables
 *   The variables to preprocess.
 */
function _ooe_preprocess_html_add_sprites(array &$variables): void {
  /** @var \Drupal\Core\Extension\ThemeExtensionList $extension_theme_list */
  $extension_theme_list = \Drupal::service('extension.list.theme');
  $sprites_svg = implode(DIRECTORY_SEPARATOR, [
    $extension_theme_list->getPath('ooe'),
    'upstream-components',
    'sprite',
    'dist',
    'sprites.svg',
  ]);

  if (file_exists($sprites_svg)) {

    // Be sure to sanitize the markup, as it's a third party dependency now.
    $allowed_elements = ['svg', 'defs', 'path', 'g', 'circle'];
    $safe_svg_markup = Xss::filter(file_get_contents($sprites_svg), $allowed_elements);

    $variables['page_top'][] = [
      '#type' => 'markup',
      '#markup' => Markup::create($safe_svg_markup),
    ];
  }
}

/**
 * Implements hook_preprocess_html().
 */
function ooe_preprocess_html(array &$variables): void {
  _ooe_preprocess_html_add_cms_binding($variables);
  _ooe_preprocess_html_add_webfonts($variables);
  _ooe_preprocess_html_add_sprites($variables);
}

/**
 * Ensures that the required asterisk falls before webform help in titles.
 *
 * @param array $variables
 *   The variables to preprocess.
 */
function _ooe_preprocess_required_indicator(array &$variables): void {
  // If we're dealing with a build array for the title...
  if (is_array($variables['title'])) {
    if (isset($variables['title']['title'], $variables['title']['help'])) {
      $variables['title']['title']['#markup'] = '<span class="form-required-asterisk">' . $variables['title']['title']['#markup'] . '</span>';
    }
    else {
      $variables['title']['#markup'] = '<span class="form-required-asterisk">' . $variables['title']['#markup'] . '</span>';
    }
  }
  // Otherwise the title is string-like.
  else {
    $variables['title'] = new TranslatableMarkup('<span class="form-required-asterisk">@title</span>', ['@title' => $variables['title']]);
  }
}

/**
 * Implements hook_preprocess_HOOK() for checkboxes.
 */
function ooe_preprocess_checkboxes(array &$variables): void {
  $variables['attributes']['class'][] = 'form-type-checkboxes';
  $variables['#attached']['library'][] = 'ooe/form-type-checkboxes';
}

/**
 * Implements hook_preprocess_HOOK() for details.
 */
function ooe_preprocess_details(array &$variables): void {
  $variables['#attached']['library'][] = 'ooe/form-type-details';
  _ooe_preprocess_required_indicator($variables);
}

/**
 * Implements hook_preprocess_HOOK() for fieldset.
 */
function ooe_preprocess_fieldset(array &$variables): void {
  $variables['#attached']['library'][] = 'ooe/fieldset';
  $variables['#attached']['library'][] = 'ooe/legend';

  // Ensure that the required asterisk falls before webform help.
  $variables['legend']['title']['#markup'] = '<span class="form-required-asterisk">' . $variables['legend']['title']['#markup'] . '</span>';
}

/**
 * Implements hook_preprocess_HOOK() for form.
 */
function ooe_preprocess_form(&$variables): void {
  $variables['#attached']['library'][] = 'ooe/form';
  $variables['#attached']['library'][] = 'ooe/form-actions';

  // @todo Eliminate remaining form-specific styles.
  if (isset($variables['element']['#id'])) {
    $form_id = $variables['element']['#id'];
    $variables['attributes']['class'][] = Html::getClass('form--' . $form_id);
    $variables['#attached']['library'][] = 'ooe/form--' . $form_id;
  }
}

/**
 * Implements hook_preprocess_HOOK() for form_element.
 */
function ooe_preprocess_form_element(array &$variables): void {
  $variables['#attached']['library'][] = 'ooe/form-item';
  if (isset($variables['type'])) {
    $type = Html::getClass($variables['type']);
    $variables['#attached']['library'][] = "ooe/form-type-$type";
  }
}

/**
 * Implements hook_preprocess_HOOK() for form_element_label.
 */
function ooe_preprocess_form_element_label(array &$variables): void {
  $variables['#attached']['library'][] = 'ooe/label';
  _ooe_preprocess_required_indicator($variables);
}

/**
 * Implements hook_preprocess_HOOK() for input.
 */
function ooe_preprocess_input(array &$variables): void {
  $element_type = $variables['attributes']['type'] ?? 'text';
  $variables['#attached']['library'][] = "ooe/input-$element_type";
  if (($element_type === 'file') && isset($variables['element']['#errors'])) {
    $variables['errors'] = $variables['element']['#errors'];
  }
}

/**
 * Implements hook_preprocess_HOOK() for managed_file.
 */
function ooe_preprocess_file_managed_file(array &$variables): void {
  $variables['#attached']['library'][] = 'ooe/file-managed-file';
  $variables['attributes']['class'][] = 'form-type-managed-file';
  $cardinality = $variables['element']['#multiple'] ? 'multiple' : 'single';
  $variables['attributes']['class'][] = 'form-type-managed-file-' . $cardinality;

  // The required attribute isn't supported for file uploads in core...
  // @see https://www.drupal.org/project/drupal/issues/2938441
  if ($variables['element']['#required']) {
    $variables['element']['upload']['#required'] = TRUE;
    $variables['element']['upload']['#required_error'] = $variables['element']['#required_error'] ?? new TranslatableMarkup('@title field is required', ['@title' => $variables['element']['#title']]);
  }
  if (isset($variables['element']['#button']) && $variables['element']['#button'] === TRUE) {
    $variables['attributes']['class'][] = 'form-type-managed-file-button';
  }

  // Non-webform varieties of managed file inputs don't add this class.
  if ($variables['element']['#errors']) {
    $variables['attributes']['class'][] = 'error';
  }
}

/**
 * Implements hook_preprocess_HOOK() for node.
 */
function ooe_preprocess_node(&$variables): void {
  /** @var \Drupal\node\NodeInterface $node */
  $node = $variables['node'];
  $bundle = str_replace('_', '-', $node->bundle());
  $variables['#attached']['library'][] = "ooe/node--$bundle";
}

/**
 * Implements hook_preprocess_HOOK() for radios.
 */
function ooe_preprocess_radios(array &$variables): void {
  $variables['attributes']['class'][] = 'form-type-radios';
  $variables['#attached']['library'][] = 'ooe/form-type-radios';
}

/**
 * Implements hook_preprocess_HOOK() for select.
 */
function ooe_preprocess_select(array &$variables): void {
  if (isset($variables['element']['#select2'])) {
    $variables['#attached']['library'][] = 'ooe/select2';
  }
  else {
    $variables['#attached']['library'][] = 'ooe/select';
  }
}

/**
 * Implements hook_preprocess_HOOK() for textarea.
 */
function ooe_preprocess_textarea(array &$variables): void {
  $variables['#attached']['library'][] = 'ooe/textarea';
}

/**
 * Implements hook_preprocess_HOOK() for webform.
 */
function ooe_preprocess_webform(array &$variables): void {
  $webform_id = $variables['element']['#webform_id'];
  /** @var \Drupal\webform\WebformInterface $webform */
  $webform = Webform::load($webform_id);

  if ($webform->getSetting('ajax')) {
    $variables['#attached']['library'][] = 'ooe/webform-ajax';
  }
}

/**
 * Implements hook_preprocess_HOOK() for webform_actions.
 */
function ooe_preprocess_webform_actions(array &$variables): void {
  $variables['#attached']['library'][] = 'ooe/webform-actions';

  // Normalize the presence of the 'webform-button' class.
  foreach (Element::children($variables['element']) as $button) {
    $variables['element'][$button]['#attributes']['class'][] = 'webform-button';
  }
  foreach (['submit', 'update', 'preview', 'preview_next', 'delete', 'wizard_next', 'wizard_prev', 'preview_prev'] as $button) {
    $variables['element'][$button]['#attributes']['class'][] = 'cta-block';
  }

  foreach (['submit', 'update', 'preview', 'preview_next', 'delete', 'wizard_next'] as $button) {
    $variables['element'][$button]['#attributes']['class'][] = 'cta-block--on-dark-reversed';
  }
  // Set the proper default icons.
  $variables['element']['delete']['#attributes']['data-icon-before'] ??= 'fas-trash';
  $variables['element']['submit']['#attributes']['data-icon-after'] ??= 'fas-paper-plane';
  $variables['element']['preview_next']['#attributes']['data-icon-after'] ??= 'fas-chevron-right';
  $variables['element']['wizard_next']['#attributes']['data-icon-after'] ??= 'fas-chevron-right';
  $variables['element']['preview_prev']['#attributes']['data-icon-before'] ??= 'fa-chevron-left';
  $variables['element']['wizard_prev']['#attributes']['data-icon-before'] ??= 'fa-chevron-left';
}

/**
 * Implements hook_preprocess_HOOK() for webform_progress.
 */
function ooe_preprocess_webform_progress(array &$variables): void {
  /** @var \Drupal\webform\WebformInterface $webform */
  $webform = $variables['webform'];

  if ($webform->getSetting('form_required')) {
    $variables['required'] = [
      '#theme' => 'webform_required',
      '#label' => $webform->getSetting('form_required_label', TRUE),
    ];
  }

  if (isset($variables['current_page'])) {
    $elements = $webform->getElementsDecodedAndFlattened();
    if (isset($elements[$variables['current_page']])) {
      $variables['title'] = $elements[$variables['current_page']]['#title'];
    }
  }
}

/**
 * Implements hook_preprocess_HOOK() for webform_required.
 */
function ooe_preprocess_webform_required(array &$variables): void {
  $variables['#attached']['library'][] = 'ooe/webform-required';
}

/**
 * Implements hook_preprocess_HOOK() for webform_section.
 */
function ooe_preprocess_webform_section(array &$variables): void {
  _ooe_preprocess_required_indicator($variables);
}

/**
 * Implements hook_preprocess_HOOK() for menu.
 */
function ooe_preprocess_menu(array &$variables): void {
  // The design system requires that the <front> route be manually marked.
  /** @var \Drupal\Core\Path\PathMatcherInterface $path_matcher */
  $path_matcher = \Drupal::service('path.matcher');
  foreach ($variables['items'] as &$item) {
    /** @var \Drupal\Core\Url $url */
    $url = $item['url'];

    if ($url->toUriString() === 'route:<front>') {

      // Previously, we relied on Drupal's 'ActiveLinkResponseFilter' to do
      // this for us by adding an 'is-active' class to the homepage link. Since
      // the design system now manages the rendering of menu markup, that won't
      // work anymore...so we can manually add the active trail flag on homepage
      // links while on the homepage and removing the active trail flag when
      // not on the homepage.
      $item['in_active_trail'] = $path_matcher->isFrontPage();

      // We have to vary the cache based on whether we're on the front page or
      // not because the output of the menu is expected to change based on this
      // condition.
      $variables['#cache']['contexts'][] = 'url.path.is_front';
    }
  }
  unset($item);
}

/**
 * Implements hook_preprocess_HOOK() for region.
 */
function ooe_preprocess_region(array &$variables): void {
  $variables['attributes']['class'][] = 'region';
  $variables['attributes']['class'][] = Html::getClass('region--' . $variables['region']);
}
