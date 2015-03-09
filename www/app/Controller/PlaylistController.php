<?php

class PlaylistController extends AppController {
	public $uses = array('Playlist');

	private function json($object) {

		return new CakeResponse(
			array(
				'type' => 'text/json',
				'body' => json_encode($object)
			)
		);
	}

	private function error($type, $message) {
		return new CakeResponse(
			array(
				'type' => 'text/json',
				'body' => json_encode(array(
					'error' => true,
					'type' => $type,
					'message' => $message
				))
			)
		);
	}

	private function simplify_array($array, $model) {
		$result = array();
		foreach ($array as $record) {
			$result[] = $record[$model];
		}
		return $result;
	}

	private function format_list($input) {
		$f = 'default';
		if (array_key_exists('format', $this->request->query))
			$f = $this->request->query['format'];

		switch ($f) {
			case 'default':
			default:
				break;
			case 'simple':
				$input = $this->simplify_array($input,'Playlist');
				break;
		}
		return $this->json($input);
	}

	private function format_record($input) {
		$f = 'default';
		if (array_key_exists('format', $this->request->query))
			$f = $this->request->query['format'];

		switch ($f) {
			case 'default':
			default:
				break;
			case 'simple':
				$input = $input['Playlist'];
				break;
		}
		return $this->json($input);
	}

	public function beforeFilter() {
		parent::beforeFilter();
	}

	public function index() {
		
		$mode = (array_key_exists('mode', $this->request->query)) ? $this->request->query['mode'] : null;
		$slug = (array_key_exists('slug', $this->request->query)) ? $this->request->query['slug'] : null;
		
		$cnds = array();
		if (!is_null($mode)) $cnds['mode'] = $mode;
		if (!is_null($slug)) $cnds['slug'] = $slug;

		$result = $this->Playlist->find('all', array('conditions' => $cnds));
		
		return $this->format_list($result);
	}

	public function view($id=null) {
		$result = $this->Playlist->findById($id);

		return $this->format_record($result);
	}

	public function add() {
		$data = $this->request->data;
		$track_id = $data['Playlist']['track_id'];
		$track = $this->Playlist->find('first', array(
			'conditions' => array('track_id' => $track_id)
		));
		$data['Playlist']['counter'] = 1;
		if ($track) {
			$data['Playlist']['id'] = $track['Playlist']['id'];
			$data['Playlist']['counter'] = $track['Playlist']['counter'] + 1;
		}
		$result = $this->Playlist->save($data);
		return $this->json($data);
	}

	public function edit($id=null) {
		$this->Playlist->id = $id;
		$r = $this->Playlist->findById($id);
		if ($r) {
	        if ($this->Playlist->save($this->request->data)) {
	        	$r = $this->Playlist->findById($id);
	            return $this->json($r);
	        } else {
	            return $this->error("Edit Failed","An error occured while trying to save the edit");
	        }
	    } else {
	    	return $this->error("Edit Failed","User with ID '$id' does not exist");
	    }
	}

	public function delete($id=null) {
		$r = $this->Playlist->findById($id);
		if ($r) {
			$this->Playlist->delete($id);
			$r['_deleted'] = true;
			return $this->json($r);
		} else {
			return $this->error("Delete failed","No record with id '$id' found");
		}
	}
}

?>