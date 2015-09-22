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

    function getPointByExpressIDAndName($express_id, $point_name) {
        $this->db->where('express_id', $express_id);
        $this->db->where('express_point_name', $point_name);
        $query = $this->db->get('express_point');
        $point = $query->first_row();
        return $point;
    }

    function getPoints($data) {
        $filter = $data['filter'];
        $data = array(
            'page' => (int)$data['page'],
            'limit'=> (int)$data['limit'],
            'sort' => $data['sort'],
            'dir'  => $data['dir']
        );
        if (isset($filter['province_code']) && !empty($filter['province_code'])) {
            $this->db->where('province_code', $filter['province_code']);
        }
        if (isset($filter['express_point_code'])) {
            $this->db->where('express_point_code', $filter['express_point_code']);
        }
        if (isset($filter['express_point_name'])) {
            $this->db->like('express_point_name', $filter['express_point_name']);
        }
        $this->db->limit($data['limit'],  (int)($data['page'] - 1) * $data['limit']);
        $this->db->order_by($data['sort'], $data['dir']);
        $query = $this->db->get('express_point');
        $items = $query->result_array();

        return $items;
    }

    function getPointsTotal($data) {
        $filter = $data['filter'];
        if (isset($filter['province_code']) && !empty($filter['province_code'])) {
            $this->db->where('province_code', $filter['province_code']);
        }
        if (isset($filter['express_point_code'])) {
            $this->db->where('express_point_code', $filter['express_point_code']);
        }
        if (isset($filter['express_point_name'])) {
            $this->db->like('express_point_name', $filter['express_point_name']);
        }
        return $this->db->count_all_results('express_point');
    }

    function add($data) {
        $point = array(
            'express_id'                 => $data['express_id'],
            'express_point_name'        => $data['express_point_name'],
            'express_point_code'        => $data['express_point_code'],
            'province_code'              => $data['province_code'],
            'area_code'                   => $data['area_code']
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