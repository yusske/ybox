<?php

class HomeController extends AppController {
	
	public function beforeFilter() {
		parent::beforeFilter();

		$this->layout = 'layout_users';
	}

	public function index() {

	}
}

?>