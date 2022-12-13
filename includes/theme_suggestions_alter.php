<?php

foreach (['block'] as $element) {
  require_once(__DIR__ . DIRECTORY_SEPARATOR . 'theme_suggestions_alter' . DIRECTORY_SEPARATOR . $element . '.php');
}
