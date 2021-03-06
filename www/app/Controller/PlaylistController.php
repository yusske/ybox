<?php

class PlaylistController extends AppController {
	public $uses = array('Playlist','SimplePlaylist');

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
				$input = $this->simplify_array($input,'SimplePlaylist');
				break;
			case 'complex':
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
				$input = $input['SimplePlaylist'];
				break;
			case 'complex':
				break;
		}
		return $this->json($input);
	}


	public function index() {
		
		$mode = (array_key_exists('mode', $this->request->query)) ? $this->request->query['mode'] : null;
		$slug = (array_key_exists('slug', $this->request->query)) ? $this->request->query['slug'] : null;
		$session_id = (array_key_exists('session_id', $this->request->query)) ? $this->request->query['session_id'] : null;
		//$status = (array_key_exists('status', $this->request->query)) ? $this->request->query['status'] : null;
		
		$cnds = array();
		if (!is_null($mode)) $cnds['mode'] = $mode;
		if (!is_null($slug)) $cnds['slug'] = $slug;
		if (!is_null($session_id)) $cnds['session_id'] = $session_id;
		if (!$session_id) {
			$cnds['status'] = array('new','played');
		} 
		$result = $this->SimplePlaylist->find('all', array(
			'conditions' => $cnds,
			'order' => array('SimplePlaylist.status DESC', 'SimplePlaylist.id ASC')
		));
		
		return $this->format_list($result);
	}

	public function view($id=null) {
		$result = $this->SimplePlaylist->findById($id);

		return $this->format_record($result);
	}

	public function add() {
		$data = json_decode(file_get_contents("php://input"), true);
		//$data = $this->request->data;
		$r = $this->SimplePlaylist->save($data);
		$id = $this->SimplePlaylist->getLastInsertId();
		if ($r) {
			$data['id'] = $id;
			$data['_added'] = true;
			return $this->json($data);
		} else {
			return $this->error("Add Failed","Error while trying to add");
		}
	}

	public function edit($id=null) {
		$this->SimplePlaylist->id = $id;
		$data = json_decode(file_get_contents("php://input"), true);
		$r = $this->SimplePlaylist->save($data);
		if ($r) {
			$data['_edited'] = true;
			return $this->json($data);
		} else {
			return $this->error("Edit Failed", "Error while trying to save track '$id'");
		}
	}

	public function delete($id=null) {
		$r = $this->SimplePlaylist->findById($id);
		if ($r) {
			$this->SimplePlaylist->id = $id;
			$this->SimplePlaylist->save(array('status' => 'discarded'));
			$r['_deleted'] = true;
			return $this->json($r);
		} else {
			return $this->error("Delete failed","No record with id '$id' found");
		}
	}

	public function clear() {
		$r = $this->SimplePlaylist->deleteAll(array(
			'SimplePlaylist.status' => array('new')
		));
	}
}

?>