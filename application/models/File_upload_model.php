<?php
/**
 * Created by PhpStorm.
 * User: 周
 * Date: 2015/8/27
 * Time: 17:57
 */
class File_upload_model extends CI_Model {
//    public function __construct() {
//        parent::__construct();
//    }

    public function getFiles($data) {
        $data = array(
            'page' => (int)$data['page'],
            'limit'=> (int)$data['limit'],
            'sort' => $data['sort'],
            'dir'  => $data['dir'],
            'filter' => $data['filter']
        );

        $this->db->limit($data['limit'],  (int)($data['page'] - 1) * $data['limit']);
        $this->db->order_by($data['sort'], $data['dir']);
        $query = $this->db->get('file_upload');
        return $query->result_array();
    }

    function getFilesTotal($data){
//        $data = array(
//            'filter' => $data['filter']
//        );
        return $this->db->count_all_results('file_upload');
    }

    public function addFile($data) {
        $this->db->insert('file_upload', $data);
        $file_id = $this->db->insert_id();
        return $file_id;
    }
}