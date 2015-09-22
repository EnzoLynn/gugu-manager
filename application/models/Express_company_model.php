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
        return $query->first_row();
    }

    function getExpressByName($express_name) {
        $this->db->where('express_name', $express_name);
        $query = $this->db->get('express_company');
        return $query->first_row();
    }

    //后期改为文件缓存
    function getAllExpress() {
        $query = $this->db->get('express_company');
        //return $query->fetch_option('express_id', 'express_name');
        $rows = $query->result_array();
        $express = array();
        foreach ($rows as $row) {
            $express[$row['express_id']] = $row['express_name'];
        }
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
            'customer_field'            => $data['customer_field'],
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
            'customer_field'            => $data['customer_field'],
            'url'                          => $data['url']
        );
        $this->db->where('express_id', $express_id);
        return $this->db->update('express_company', $express);
    }
}