<?php

foreach (['off_canvas_page_wrapper', 'region', 'block'] as $element) {
  require_once(__DIR__ . DIRECTORY_SEPARATOR . 'preprocess' . DIRECTORY_SEPARATOR . $element . '.php');
}
