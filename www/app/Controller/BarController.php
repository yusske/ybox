<?php

class BarController extends AppController {
	public function beforeFilter() {
		parent::beforeFilter();

		$this->layout = 'layout_bars';
	}

	public function index() {
		
	}
}

?>