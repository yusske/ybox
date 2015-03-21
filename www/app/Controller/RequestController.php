<?php

class RequestController extends AppController {
	
	public $uses = array('Bar');

	public function beforeFilter() {
		parent::beforeFilter();

		$this->layout = 'layout_users';
	}

	public function display($id=null) {
		$r = $this->Bar->findBySlug($id);
		if ($r) {
			$this->set('record',$r);
			$this->set('error',false);
		} else {
			$this->set('record',false);
			$this->set('error',array(
				'title' => 'Bar Slug Not Found',
				'message' => 'Make sure your url is correct.'
			));
		}
	}

}

?>