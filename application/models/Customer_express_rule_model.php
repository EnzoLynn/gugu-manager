<?php
/**
 * Created by PhpStorm.
 * User: 周
 * Date: 2015/8/26
 * Time: 10:41
 */
class Customer_express_rule_model extends CI_Model {
    var $CI;
    function __construct() {
        parent::__construct();
        $this->CI = &get_instance();
        $this->CI->load->model('customer_rent_model');
        $this->CI->load->model('customer_express_rule_item_model');
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

        //echo $this->db->last_query();exit;

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
            'province_code' => $data['province_code']
        );
        $this->db->insert('customer_express_rule', $rule);
        $rule_id = $this->db->insert_id();
        return $rule_id;
    }

    function update($rule_id, $data) {
//        $rule = array(
//            'customer_id' => $data['customer_id'],
//            'customer_rent_id' => $data['customer_rent_id'],
//            'province_code' => $data['province_code']
//        );
        $this->db->where('rule_id', $rule_id);
        return $this->db->update('customer_express_rule', $data);
    }

    function delete($rule_id) {
        $this->db->where('rule_id', $rule_id);
        return $this->db->delete('customer_express_rule');
    }

    //通过重量得到规则
    function getItemByRuleAndWeightBetween($rule_id, $weight_min, $weight_max) {
        $rule = $this->getOne($rule_id);
        if ($rule) {
            $this->db->where('rule_id', $rule['rule_id']);
            $this->db->where("weight_min", $weight_min);
            $this->db->where("weight_max", $weight_max);
            $this->db->order_by('sort_order', 'ASC');
            $query = $this->db->get('customer_express_rule_item');
            $rule_item = $query->first_row();
            return $rule_item;
        } else {
            return FALSE;
        }
    }

    //通过重量得到规则
    function getItemByRuleAndWeight($rule_id, $weight) {
        $rule = $this->getOne($rule_id);
        if ($rule) {
            $this->db->where('rule_id', $rule['rule_id']);
            $this->db->where("weight_min < $weight AND weight_max > $weight");
            $this->db->order_by('sort_order', 'ASC');
            $query = $this->db->get('customer_express_rule_item');
            $rule_item = $query->first_row();
            return $rule_item;
        } else {
            return FALSE;
        }
    }

    //通过重量得到规则
    function getItemByWeight($customer_rent_id, $express_point_code, $weight) {
        $this->db->where('express_point_code', $express_point_code);
        $query = $this->db->get('express_point');
        $express_point = $query->first_row();
        $province_code = $express_point['province_code'];

        $rule = $this->getOneByRent($customer_rent_id, $province_code);

        if ($rule) {
            $this->db->where('rule_id', $rule['rule_id']);
            $this->db->where("$weight BETWEEN weight_min AND weight_max");
            $this->db->order_by('sort_order', 'ASC');
            $query = $this->db->get('customer_express_rule_item');
            $rule_item = $query->first_row();
            return $rule_item;
        } else {
            return FALSE;
        }
    }
    //根据合同复制齐下的所有规则
    function copyRule($customer_rent_id_from, $customer_rent_id_to) {
        $rent_from = $this->CI->customer_rent_model->getCustomerRent();
        $customer_id_from = $rent_from['customer_id'];

        $rent_to = $this->CI->customer_rent_model->getCustomerRent();
        $customer_id_to = $rent_to['customer_id'];

        $rule_from = $this->getCustomerExpressRules($customer_rent_id_from);
        foreach ($rule_from as $row) {
            $rule_items_from = $this->CI->customer_express_rule_item_model->getItems($row['rule_id']);

            unset($row['rule_id']);
            $row['customer_id'] = $customer_id_to;
            $row['customer_rent_id'] = $customer_rent_id_to;
            $rule_id = $this->add($row);

            foreach ($rule_items_from as $item) {
                $item['rule_id'] = $rule_id;
                $item['customer_id'] = $customer_id_to;
                $item['customer_rent_id'] = $customer_rent_id_to;
                $this->CI->customer_express_rule_item_model->add($item);
            }
        }
    }
}