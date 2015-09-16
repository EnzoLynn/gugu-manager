<?php
/**
 * Created by PhpStorm.
 * User: 周
 * Date: 2015/8/24
 * Time: 15:35
 */


class Customer_rent_model extends CI_Model {
    var $CI;
    function __construct() {
        parent::__construct();
        $this->CI = &get_instance();
        $this->CI->load->model('customer_express_rule_model');
        $this->CI->load->model('customer_express_rule_item_model');
    }

    function getCustomerRent($customer_rent_id) {
        if($customer_rent_id) {
            $this->db->where('customer_rent_id', $customer_rent_id);
            $query = $this->db->get('customer_rent');
            $customerRent = $query->first_row();
            return $customerRent;
        }else{
            return array();
        }
    }

    function getCustomerRentByRentNo($rent_no) {
        if($rent_no) {
            $this->db->where('rent_no', $rent_no);
            $query = $this->db->get('customer_rent');
            $customerRent = $query->first_row();
            return $customerRent;
        }else{
            return array();
        }
    }

    function getCustomerRentByCustomerIDAndDate($customer_id, $date) {
        $this->db->where('customer_id', $customer_id);
        $date = date('Y-m-d', strtotime($date));
        $this->db->where("'$date' between date_start and date_end");
        $query = $this->db->get('customer_rent');
        $customerRent = $query->first_row();
        return $customerRent;
    }

    function getCustomerRents($data) {
        $data = array(
            'customer_id' => (int)$data['customer_id'],
            'page' => (int)$data['page'],
            'limit'=> (int)$data['limit'],
            'sort' => $data['sort'],
            'dir'  => $data['dir'],
            'filter' => $data['filter']
        );

        $this->db->limit($data['limit'],  (int)($data['page'] - 1) * $data['limit']);
        $this->db->where('customer_id', $data['customer_id']);
        //$this->db->like($data['filter']);
        $this->db->order_by($data['sort'], $data['dir']);
        $query = $this->db->get('customer_rent');
        return $query->result_array();
    }

    function getCustomerRentsTotal($data) {
        $data = array(
            'customer_id' => (int)$data['customer_id'],
            'filter' => $data['filter']
        );
        $this->db->where('customer_id', $data['customer_id']);
        //$this->db->like($data['filter']);
        return $this->db->count_all_results('customer_rent');
    }

    function addCustomerRent($data) {
        $data['updated_at'] = date('Y-m-d H:i:s');
        $this->db->insert('customer_rent', $data);
        return  $this->db->insert_id();
    }

    function updateCustomerRent($customer_rent_id, $data) {
        $this->db->where('customer_rent_id', $customer_rent_id);
        return $this->db->update('customer_rent', $data);
    }

    function deleteCustomerRent($customer_rent_id) {
        $this->db->where('customer_rent_id', $customer_rent_id);
        return $this->db->delete('customer_rent');
    }

    function existRentNo($rent_no, $rent_id = 0) {
        $this->db->where('rent_no', $rent_no);
        if ($rent_id > 0) {
            $this->db->where('rent_id<>' . $rent_id);
        }
        $query = $this->db->get('customer_rent');
        if($query->num_rows() == 0 ){
            return FALSE;
        }else {
            return TRUE;
        }
    }

    //根据合同复制齐下的所有规则
    function copyRule($customer_rent_id_from, $customer_rent_id_to) {
        $rent_to = $this->getCustomerRent($customer_rent_id_to);
        $customer_id_to = $rent_to['customer_id'];
        //先清除目标的所有规则
        $this->CI->customer_express_rule_model->deleteByRentID($customer_rent_id_to);
        $this->CI->customer_express_rule_item_model->deleteByRentID($customer_rent_id_to);
        //再遍历插入
        $rule_from = $this->CI->customer_express_rule_model->getCustomerExpressRules($customer_rent_id_from);
        foreach ($rule_from as $row) {
            $rule_items_from = $this->CI->customer_express_rule_item_model->getItems($row['rule_id']);

            unset($row['rule_id']);
            $row['customer_id'] = $customer_id_to;
            $row['customer_rent_id'] = $customer_rent_id_to;

            $rule_id = $this->CI->customer_express_rule_model->add($row);

            foreach ($rule_items_from as $item) {
                $item['rule_id'] = $rule_id;
                $item['customer_id'] = $customer_id_to;
                $item['customer_rent_id'] = $customer_rent_id_to;
                $this->CI->customer_express_rule_item_model->add($item);
            }
        }
    }
}