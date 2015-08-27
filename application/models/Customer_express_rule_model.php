<?php
/**
 * Created by PhpStorm.
 * User: 周
 * Date: 2015/8/26
 * Time: 10:41
 */
class Customer_express_rule_model extends CI_Model {
    function __construct() {
        parent::__construct();
    }

    function getOne($rule_id) {
        $this->db->where('rule_id', $rule_id);
        $query = $this->db->get('customer_express_rule');
        $rule = $query->first_row();
        return $rule;
    }

    function getOneByRent($customer_rent_id, $province_code) {
        $this->db->where('customer_rent_id', $customer_rent_id);
        $this->db->where('province_code', $province_code);
        $query = $this->db->get('customer_express_rule');
        $rule = $query->first_row();
        return $rule;
    }

    function getCustomerExpressRules($customer_rent_id) {
        $this->db->where('customer_rent_id', $customer_rent_id);
        //$this->db->order_by($data['sort'], $data['dir']);
        $query = $this->db->get('customer_express_rule');
        $customer_numbers = $query->result_array();

        return $customer_numbers;
    }

    function getCustomerExpressRulesTotal($customer_rent_id) {
        $this->db->where('customer_rent_id', $customer_rent_id);
        return $this->db->count_all_results('customer_express_rule');
    }

    function add($data) {
        $rule = array(
            'customer_id' => $data['customer_id'],
            'customer_rent_id' => $data['customer_rent_id'],
            'province_code' => $data['province_code'],
            'price_type' => $data['price_type'],
            'price_start' => $data['price_start'],
            'price_pre' => $data['price_pre']
        );
        $this->db->insert('customer_express_rule', $rule);
        $rule_id = $this->db->insert_id();
        return $rule_id;
    }

    function update($rule_id, $data) {
//        $rule = array(
//            'customer_id' => $data['customer_id'],
//            'customer_rent_id' => $data['customer_rent_id'],
//            'province_code' => $data['province_code'],
//            'price_type' => $data['price_type'],
//            'price_start' => $data['price_start'],
//            'price_pre' => $data['price_pre']
//        );
        $this->db->where('rule_id', $rule_id);
        return $this->db->update('customer_express_rule', $data);
    }

    function delete($rule_id) {
        $this->db->where('rule_id', $rule_id);
        return $this->db->delete('customer_express_rule');
    }
}