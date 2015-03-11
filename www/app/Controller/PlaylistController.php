<?php

class PlaylistController extends AppController {
	public $uses = array('Playlist');

	private function json($object) {
		$this->response->type('text/json');
		$this->response->body(json_encode($object));
		return $this->response;
	}

	private function error($type, $message) {
		$this->response->type('text/json');
		$this->response->body(json_encode(array(
			'error' => true,
			'type' => $type,
			'message' => $message
		)));
		return $this->response;
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
				$input = $this->simplify_array($input,'Playlist');
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
				break;
				$input = $input['Playlist'];
			case 'complex':
				break;
		}
		return $this->json($input);
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
		$mode = $data['Playlist']['mode'];
		$slug = $data['Playlist']['slug'];
		$track = $this->Playlist->find('first', array(
			'conditions' => array(
				'track_id' => $track_id,
				'mode' => $mode,
				'slug' => $slug
			)
		));
		$data['Playlist']['counter'] = 1;
		if ($track) {
			$data['Playlist']['id'] = $track['Playlist']['id'];
			$data['Playlist']['counter'] = $track['Playlist']['counter'] + 1;
		}
		$result = $this->Playlist->save($data);
		if ($result) {
			$data['_added'] = true;
			return $this->json($data);
		} else {
			return $this->error("Add Failed", "An error occured while trying to save.");
		}
	}

	public function edit($id=null) {
		$this->Playlist->id = $id;
		$r = $this->Playlist->findById($id);
		if ($r) {
	        if ($this->Playlist->save($this->request->data)) {
	        	$r = $this->Playlist->findById($id);
	        	$r['_edited'] = true;
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

	public function checksong($id=null) {
		$data = $this->request->data['s'];
		$input = array();
		$input['Playlist'] = array();
		if ($data && array_key_exists('s',$data)) {
			$status = $data['s'];
			$this->Playlist->id = $id;
			$input['Playlist']['status'] = $status;
			$r = $this->Playlist->findById($id);
			if ($r) {
				$this->Playlist->save($input);
				$input = $this->Playlist->findById($id);
				$input['_edited'] = true;
				return $this->json($input);
			}else {
				$this->error("Check Song Failed","Song id '$id' not found");
			}
		}
	}
}

?>