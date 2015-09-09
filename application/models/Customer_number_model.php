<?php
/**
 * Created by PhpStorm.
 * User: 周
 * Date: 2015/8/25
 * Time: 14:44
 */
class Customer_number_model extends CI_Model {
    var $CI;
    public function __construct(){
        parent::__construct();
        $this->CI = &get_instance();
        $this->CI->load->model('customer_model');
    }

    function getCustomerNumber($number_id) {
        $this->db->where('number_id', $number_id);
        $query = $this->db->get('customer_number');
        $customer_number = $query->first_row();
        return $customer_number;
    }

    function getCustomerNumbers($data) {
        if (isset($data['filter']['use_status'])) {
            $this->db->where('use_status', $data['filter']['use_status']);
        }
        if (isset($data['filter']['use_time_begin']) && $data['filter']['use_time_begin'] != '') {
            $this->db->where("use_time >= '". $data['filter']['use_time_begin'] ." 00:00:00'");
        }
        if (isset($data['filter']['use_time_end']) && $data['filter']['use_time_end'] != '') {
            $this->db->where("use_time <= '". $data['filter']['use_time_end'] ." 23:59:59'");
        }
        $this->db->where('customer_id', $data['customer_id']);
        $this->db->limit($data['limit'],  (int)($data['page'] - 1) * $data['limit']);
        $this->db->order_by($data['sort'], $data['dir']);
        $query = $this->db->get('customer_number');
        $customer_numbers = $query->result_array();
        return $customer_numbers;
    }

    function getCustomerNumbersTotal($data) {
        if (isset($data['filter']['use_status'])) {
            $this->db->where('use_status', $data['filter']['use_status']);
        }
        if (isset($data['filter']['use_time_begin']) && $data['filter']['use_time_begin'] != '') {
            $this->db->where("use_time >= '". $data['filter']['use_time_begin'] ." 00:00:00'");
        }
        if (isset($data['filter']['use_time_end']) && $data['filter']['use_time_end'] != '') {
            $this->db->where("use_time <= '". $data['filter']['use_time_end'] ." 23:59:59'");
        }
        $this->db->where('customer_id', $data['customer_id']);
        return $this->db->count_all_results('customer_number');
    }

    function addCustomerNumber($data) {
        $customer_number = array(
            'customer_id' => $data['customer_id'],
            'tracking_number' => $data['tracking_number'],
            'updated_at' => date('y-m-d H:i:s')
        );
        $this->db->insert('customer_number', $customer_number);
        $number_id =  $this->db->insert_id();
        return $number_id;
    }

    function updateCustomerNumber($number_id, $data) {
        $customer_number = array(
            //'customer_id' => $data['customer_id'],
            //'customer_number' => $data['customer_number'],
            'use_status' => $data['use_status'],
            'use_time' => date('y-m-d H:i:s')
        );
        $this->db->where('number_id', $number_id);
        return $this->db->update('customer_number', $customer_number);
    }

    function updateByTrackingNumber($tracking_number) {
        $customer_number = array(
            //'customer_id' => $data['customer_id'],
            //'customer_number' => $data['customer_number'],
            'use_status' => 1,
            'use_time' => date('y-m-d H:i:s')
        );
        $this->db->where('tracking_number', $tracking_number);
        return $this->db->update('customer_number', $customer_number);
    }

    function deleteCustomerNumber($number_id) {
        $this->db->where('number_id', $number_id);
        return $this->db->delete('customer_number');
    }

    function getOneByTrackingNumber($tracking_number) {
        $this->db->where('tracking_number', $tracking_number);
        $query = $this->db->get('customer_number');
        $customer_number = $query->first_row();
        if ($customer_number){
            return $customer_number;
        }else {
            return FALSE;
        }
    }
    //通过tracking_number查询到客户ID
    function getCustomerByTrackingNumber($tracking_number){
        $customer_number = $this->getOneByTrackingNumber($tracking_number);
        if ($customer_number) {
            $customer_id = (int)$customer_number['customer_id'];
            return $this->CI->customer_model->getCustomer($customer_id);
        } else {
            return FALSE;
        }
    }
}