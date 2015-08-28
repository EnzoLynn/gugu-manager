<?php
/**
 * Created by PhpStorm.
 * User: 周
 * Date: 2015/8/26
 * Time: 12:06
 */
class Express_rule_model extends CI_Model {
    public function __construct() {
        parent::__construct();
    }

    function getOne($rule_id) {
        $this->db->where('rule_id', $rule_id);
        $query = $this->db->get('express_rule');;
        $express_rule = $query->first_row();
        return $express_rule;
    }

    function getOneByProvince($express_id, $province_code) {
        $this->db->where('express_id', $express_id);
        $this->db->where('province_code', $province_code);
        $query = $this->db->get('express_rule');
        $express_rule = $query->first_row();
        return $express_rule;
    }

    function getExpressRules($express_id) {
        $this->db->where('express_id', $express_id);
        //$this->db->order_by($data['sort'], $data['dir']);
        $query = $this->db->get('express_rule');
        $customer_numbers = $query->result_array();
        return $customer_numbers;
    }

    function getExpressRulesTotal($express_id) {
        $this->db->where('express_id', $express_id);
        return $this->db->count_all_results('express_rule');
    }

    function add($data) {
        $express_rule = array(
            'express_id' => $data['express_id'],
            'province_code'  => $data['province_code'],
            'update_at' => date('Y-m-d H:i:s')
        );
        $this->db->insert('express_rule', $express_rule);
        $rule_id =  $this->db->insert_id();
        return $rule_id;
    }

    function delete($rule_id) {
        $this->db->where('rule_id', $rule_id);
        return $this->db->delete('express_rule');
    }
    //通过重量得到规则
    function getItemByWeight($express_id, $express_point_code, $weight) {
        $this->db->where('express_id', $express_id);
        $this->db->where('express_point_code', $express_point_code);
        $query = $this->db->get('express_point');
        $express_point = $query->first_row();
        $province_code = $express_point['province'];

        $rule = $this->getOneByProvince($express_id, $province_code);
        $rule_id = $rule['rule_id'];

        $this->db->where('rule_id', $rule_id);
        $this->db->where("$weight BETWEEN weight_min AND weight_max");
        $this->db->order_by('sort_order', 'ASC');
        $query = $this->db->get('express_rule_item');
        return $query->first_row();
    }
}