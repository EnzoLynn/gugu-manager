<?php
/**
 * Created by PhpStorm.
 * User: 周
 * Date: 2015/8/25
 * Time: 14:44
 */
class Customer_number_model extends CI_Model
{
    var $CI;

    function __construct(){
        parent::__construct();
        $this->CI = &get_instance();
    }

    function getCustomerNumber($number_id){
        $data = array(
            'number_id' => $number_id
        );
        $this->db->where($data);
        $query = $this->db->get('customer_number');
        $customer_number = $query->first_row();
        return $customer_number;
    }

    function getCustomerNumbers($customer_id){
        $data = array(
            'customer_id' => $customer_id
        );
        $this->db->where($data);
        $query = $this->db->get('customer_number');
        $customer_numbers = $query->result_array();
        return $customer_numbers;
    }

    function addCustomerNumber($data) {
        $customer_number = array(
            'customer_id' => $data['customer_id'],
            'customize_number_prefix' => $data['customize_number_prefix'],
            'customize_number_from' => $data['customize_number_from'],
            'customize_number_to' => $data['customize_number_to'],
            'customize_number_suffix' => $data['customize_number_suffix']
        );
        $this->db->insert('customer_number', $customer_number);
        $number_id =  $this->db->insert_id();
        return $number_id;
    }

    function updateCustomerNumber($number_id, $data) {
        $customer_number = array(
            'customer_id' => $data['customer_id'],
            'customize_number_prefix' => $data['customize_number_prefix'],
            'customize_number_from' => $data['customize_number_from'],
            'customize_number_to' => $data['customize_number_to'],
            'customize_number_suffix' => $data['customize_number_suffix']
        );
        $this->db->where('number_id', $number_id);
        return $this->db->update('customer_number', $customer_number);
    }

    function deleteCustomerNumber($number_id) {
        $this->db->where('number_id', $number_id);
        return $this->db->delete('customer_number');
    }

    //通过tracking_number查询到客户ID
    function getCustomerID($tracking_number){

    }
}