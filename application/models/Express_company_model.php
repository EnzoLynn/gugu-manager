<?php
/**
 * Created by PhpStorm.
 * User: 周
 * Date: 2015/8/26
 * Time: 10:50
 */
class Express_company_model extends CI_Model {
    function __construct() {
        parent::__construct();
    }

    function getOne($express_id) {
        $this->db->where('express_id', $express_id);
        $query = $this->db->get('express_company');
        $rule = $query->first_row();
        return $rule;
    }

    function getExpressByName($express_nam) {
        $this->db->where('express_nam', $express_nam);
        $query = $this->db->get('express_company');
        $express = $query->first_row();
        return $express;
    }

    function getAll() {
        $this->db->order_by('express_id', 'ASC');
        $query = $this->db->get('express_company');
        $rows = $query->result_array();
        return $rows;
    }

    function getAllTotal() {
        return $this->db->count_all_results('express_company');
    }

    function add($data) {
        $express = array(
            'express_id'                 => $data['express_id'],
            'express_name'               => $data['express_name'],
            'express_code'               => $data['express_code'],
            'url'                          => $data['url']
        );
        $this->db->insert('express_company', $express);
        $express_id = $this->db->insert_id();
        return $express_id;
    }

    function update($express_id, $data) {
        $express = array(
            'express_name'               => $data['express_name'],
            'express_code'               => $data['express_code'],
            'url'                          => $data['url']
        );
        $this->db->where('express_id', $express_id);
        return $this->db->update('express_company', $express);
    }
}