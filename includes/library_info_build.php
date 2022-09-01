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
  foreach ($extension_theme_list->getExtensionInfo('ooe')['components']['namespaces'] as $namespace) {
    $namespace_path = $extension_theme_list->getPath('ooe') . DIRECTORY_SEPARATOR . $namespace;
    if (file_exists($namespace_path)) {
      $components = new DirectoryIterator($namespace_path);
      foreach ($components as $component) {

        $library_name = "ooe.{$component->getFilename()}";

        // Resolve javascript files.
        if (file_exists($component->getPathname() . '/dist/scripts.js')) {
          $libraries[$library_name]['js'] = [$namespace . '/' . $component->getFilename() . '/dist/scripts.js' => []];
        }

        // Resolve CSS files.
        if (file_exists($component->getPathname() . '/dist/styles.css')) {
          $libraries[$library_name]['css']['theme'] = [$namespace . '/' . $component->getFilename() . '/dist/styles.css' => []];
        }

        // Resolve dependencies.
        $package_manifest = $component->getPathname() . '/package.json';
        if (file_exists($package_manifest)) {
          $json = Json::decode(file_get_contents($package_manifest));
          foreach ($json['dependencies'] as $dependency => $version) {
            $dependency_library_name = str_replace('@psu-ooe', 'ooe', $dependency);
            $libraries[$library_name]['dependencies'][] = $dependency_library_name;
          }
        }
      }
    }
  }
  return $libraries;
}
