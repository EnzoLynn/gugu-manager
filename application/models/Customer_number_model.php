<?php
/**
 * Created by PhpStorm.
 * User: 周
 * Date: 2015/8/25
 * Time: 14:44
 */
class Customer_number_model extends CI_Model {
    function __construct() {
        parent::__construct();
    }

    function getCustomerNumber($number_id) {
        $this->db->where('number_id', $number_id);
        $query = $this->db->get('customer_number');
        $customer_number = $query->first_row();
        return $customer_number;
    }

    function getCustomerNumbers($data) {
        $data = array(
            'customer_id' => $data['customer_id'],
            'page' => (int)$data['page'],
            'limit'=> (int)$data['limit'],
            'sort' => $data['sort'],
            'dir'  => $data['dir']
            //'filter' => $data['filter']
        );

        $this->db->limit($data['limit'],  (int)($data['page'] - 1) * $data['limit']);
        $this->db->where('customer_id', $data['customer_id']);
        $this->db->order_by($data['sort'], $data['dir']);
        $query = $this->db->get('customer_number');
        $customer_numbers = $query->result_array();

        return $customer_numbers;
    }

    function getCustomerNumbersTotal($customer_id) {
        $this->db->where('customer_id', $customer_id);
        return $this->db->count_all_results('customer_number');
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
        $arr = array();
        $num = preg_match('/[A-Za-z]+/i', $tracking_number, $arr);
        if($num == 0){
            $query = $this->db->query("SELECT customer_id FROM customer_number WHERE $tracking_number BETWEEN CAST(customize_number_from AS UNSIGNED) AND CAST(customize_number_to AS UNSIGNED) ");
            $row = $query->first_row();
            return (int)$row['customer_id'];
        }else if($num == 1){
            $tracking_number = str_replace($arr[0], '', $tracking_number);//去掉字母
            $query = $this->db->query("SELECT customer_id FROM customer_number WHERE customize_number_prefix='$arr[0]' AND $tracking_number BETWEEN CAST(customize_number_from AS UNSIGNED) AND CAST(customize_number_to AS UNSIGNED)  ");
            $row = $query->first_row();
            return (int)$row['customer_id'];
        }else{
            return 0;
        }
    }
}