<?php
/**
 * Created by PhpStorm.
 * User: 周
 * Date: 2015/8/24
 * Time: 15:35
 */


class Customer_model extends CI_Model{
    var $CI;
    function __construct($table=''){
        parent::__construct();
        $this->CI = &get_instance();
    }

    function getCustomer($customer_id){
        $query = $this->db->select('*')->where('customer_id', $customer_id);
        $customer = $query->first_row();
        return $customer;
    }

    function getCustomers($data){
        $data = array(
            'page' => int($data['page']),
            'limit'=> int($data['limit']),
            'sort' => $data['sort'],
            'dir'  => $data['dir'],
            'filter' => $data['filter']
        );

        $this->db->limit($data['limit'],  (int)($data['page'] - 1) * $data['limit']);
        $this->db->like($data['filter']);
        $this->db->order_by($data['sort'], $data['dir']);
        $query = $this->db->get('customer');
        return $query->result_array();
    }

    function getCustomersTotal($data){
        $data = array(
            'filter' => $data['filter']
        );

        $this->db->like($data['filter']);
        return $this->db->count_all('customer');
    }

}