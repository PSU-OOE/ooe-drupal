<?php

/**
 * @file
 * Generic theme suggestion hooks for the ooe theme.
 */

/**
 * Implements hook_theme_suggestions_HOOK_alter() for form_element.
 */
function ooe_theme_suggestions_form_element_alter(array &$suggestions, array $variables): void {
  if (isset($variables['element'])) {

    // Offer a suggestion for the native FAPI type.
    if (isset($variables['element']['#type'])) {
      $suggestion = 'form_element__' . $variables['element']['#type'];
      if (!isset($suggestions[$suggestion])) {
        array_unshift($suggestions, $suggestion);
      }
    }

    // Offer a suggestion for the webform type (if applicable).
    if (isset($variables['element']['#webform_plugin_id'])) {
      $suggestion = 'form_element__' . $variables['element']['#webform_plugin_id'];
      if (in_array(
        $variables['element']['#webform_plugin_id'],
        ['webform_audio_file', 'webform_document_file', 'webform_image_file', 'webform_video_file'], TRUE)
      ) {
        $suggestions[] = 'form_element__managed_file';
      }
      elseif (!in_array($suggestions, $suggestions, TRUE)) {
        $suggestions[] = $suggestion;
      }

    }
  }
}

/**
 * Implements hook_theme_suggestions_HOOK_alter() for input.
 */
function ooe_theme_suggestions_input_alter(array &$suggestions, array $variables): void {

  // Some inputs (like autocomplete inputs) require additional markup.
  if (isset($variables['element']['#type'])) {
    $suggestion = 'input__' . $variables['element']['#type'];
    if (!in_array($suggestion, $suggestions, TRUE)) {
      array_unshift($suggestions, $suggestion);
    }
  }
}
