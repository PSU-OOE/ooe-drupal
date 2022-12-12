<?php

foreach (['html', 'off_canvas_page_wrapper', 'region', 'block', 'menu'] as $element) {
  require_once(__DIR__ . DIRECTORY_SEPARATOR . 'preprocess' . DIRECTORY_SEPARATOR . $element . '.php');
}
