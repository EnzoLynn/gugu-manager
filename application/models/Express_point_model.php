<?php
/**
 * Created by PhpStorm.
 * User: 周
 * Date: 2015/8/26
 * Time: 10:50
 */
class Express_point_model extends CI_Model {
    function __construct() {
        parent::__construct();
    }

    function getOne($point_id) {
        $this->db->where('point_id', $point_id);
        $query = $this->db->get('express_point');
        $point = $query->first_row();
        return $point;
    }

    function getPointByExpressIDAndCode($express_id, $point_code) {
        $this->db->where('express_id', $express_id);
        $this->db->where('express_point_code', $point_code);
        $query = $this->db->get('express_point');
        $point = $query->first_row();
        return $point;
    }

    function getPoints($express_id) {
        $this->db->where('express_id', $express_id);
        $this->db->order_by('express_point_code', 'ASC');
        $query = $this->db->get('express_point');
        $items = $query->result_array();

        return $items;
    }

    function getItemsTotal($express_id) {
        $this->db->where('express_id', $express_id);
        return $this->db->count_all_results('express_point');
    }

    function add($data) {
        $point = array(
            'express_id'                 => $data['express_id'],
            'express_point_name'        => $data['express_point_name'],
            'express_point_code'        => $data['express_point_code'],
            'province_code'              => $data['province_code'],
            'area_code'                   => $data['area_code'],
            'update_at'                   => $data['update_at']
        );
        $this->db->insert('express_point', $point);
        $point_id = $this->db->insert_id();
        return $point_id;
    }

    function update($point_id, $data) {
        $point = array(
            'express_point_name'        => $data['express_point_name'],
            'express_point_code'        => $data['express_point_code'],
            'province_code'              => $data['province_code'],
            'area_code'                   => $data['area_code']
        );
        $this->db->where('point_id', $point_id);
        return $this->db->update('express_point', $point);
    }

    function delete($point_id) {
        $this->db->where('point_id', $point_id);
        return $this->db->delete('express_point');
    }
}