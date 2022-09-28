<?php

use Drupal\Component\Serialization\Json;

/**
 * Implements hook_library_info_build().
 *
 * Dynamically link the components into Drupal!
 *
 * for each namespace
 *   for each component in each namespace
 *     create a library
 *     if there is css, add it to the library
 *     if there is js, add it to the library
 *     if there are dependencies, declare them
 *   end component loop
 * end namespace loop
 */
function ooe_library_info_build(): array {

  $libraries = [];

  /** @var \Drupal\Core\Extension\ThemeExtensionList $extension_theme_list */
  $extension_theme_list = \Drupal::service('extension.list.theme');
  $theme_path = $extension_theme_list->getPath('ooe');
  $components_path = implode(DIRECTORY_SEPARATOR, [
    $theme_path,
    'node_modules',
    '@psu-ooe',
  ]);
  $components = new FilesystemIterator($components_path, FilesystemIterator::SKIP_DOTS);
  foreach ($components as $component) {
    if (!$component->isDir()) {
      continue;
    }

    // Resolve javascript files.
    $js_path = implode(DIRECTORY_SEPARATOR, [
      $component->getPathname(),
      'dist',
      'scripts.js',
    ]);
    if (file_exists($js_path)) {
      $libraries[$component->getFilename()]['js'] = [str_replace($theme_path.'/', '', $js_path) => []];
    }

    // Resolve CSS files.
    $css_path = implode(DIRECTORY_SEPARATOR, [
      $component->getPathname(),
      'dist',
      'styles.css',
    ]);
    if (file_exists($css_path)) {
      $libraries[$component->getFilename()]['css']['theme'] = [str_replace($theme_path.'/', '', $css_path) => []];
    }

    // Resolve dependencies.
    $package_manifest = implode(DIRECTORY_SEPARATOR, [
      $component->getPathname(),
      'package.json',
    ]);

    if (file_exists($package_manifest)) {
      $json = Json::decode(file_get_contents($package_manifest));
      if (isset($json['dependencies'])) {
        foreach ($json['dependencies'] as $dependency => $version) {
          $dependency_library_name = str_replace('@psu-ooe', 'ooe', $dependency);
          $libraries[$component->getFilename()]['dependencies'][] = $dependency_library_name;
        }
      }
    }
  }
  return $libraries;
}
