<?php
/**
 * Created by PhpStorm.
 * User: 周
 * Date: 2015/8/27
 * Time: 17:57
 */
class File_upload_model extends CI_Model {
    var $CI;
    function __construct() {
        parent::__construct();
        $this->CI = &get_instance();
//        $this->CI->load->model('customer_express_rule_model');
//        $this->CI->load->model('customer_express_rule_item_model');
    }

    public function getFile($file_id) {
        $this->db->where('file_id', $file_id);
        $query = $this->db->get('file_upload');
        return $query->first_row();
    }

    public function getWhere($data) {
        if (isset($data['filter']['file_name'])) {
            $this->db->like('file_name', $data['filter']['file_name']);
        }
        if (isset($data['filter']['file_save_name'])) {
            $this->db->like('file_save_name', $data['filter']['file_save_name']);
        }
        if (isset($data['filter']['status'])) {
            $this->db->where('status', $data['filter']['status']);
        }
    }

    public function getFiles($data) {
        $data = array(
            'page' => (int)$data['page'],
            'limit'=> (int)$data['limit'],
            'sort' => $data['sort'],
            'dir'  => $data['dir'],
            'filter' => $data['filter']
        );
        $this->getWhere($data);
        $this->db->limit($data['limit'],  (int)($data['page'] - 1) * $data['limit']);
        $this->db->order_by($data['sort'], $data['dir']);
        $query = $this->db->get('file_upload');
        return $query->result_array();
    }

    function getFilesTotal($data){
        $this->getWhere($data);
        return $this->db->count_all_results('file_upload');
    }

    public function addFile($data) {
        $this->db->insert('file_upload', $data);
        $file_id = $this->db->insert_id();
        return $file_id;
    }

    public function update($file_id, $data) {
        $this->db->where('file_id', $file_id);
        return $this->db->update('file_upload', $data);
    }

    public function delete($file_id) {
        $this->db->where('file_id', $file_id);
        return $this->db->delete('file_upload');
    }
}