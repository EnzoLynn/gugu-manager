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

    public function addFile($data) {
        $this->db->insert('file_upload', $data);
        $file_id = $this->db->insert_id();
        return $file_id;
    }
}