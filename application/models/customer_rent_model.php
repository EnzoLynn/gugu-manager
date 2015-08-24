<?php
/**
 * Created by PhpStorm.
 * User: 周
 * Date: 2015/8/24
 * Time: 15:35
 */


class Customer_rent_model extends CI_Model{
    var $CI;
    function __construct($table=''){
        parent::__construct();
        $this->CI = &get_instance();
    }

    function getCustomerRent($customer_rent_id){
        $query = $this->db->select('*')->where('customer_rent_id', $customer_rent_id);
        $customerRent = $query->first_row();
        return $customerRent;
    }

    function getCustomerRents($data){
        $data = array(
            'customer_id' => (int)$data['customer_id'],
            'page' => int($data['page']),
            'limit'=> int($data['limit']),
            'sort' => $data['sort'],
            'dir'  => $data['dir'],
            'filter' => $data['filter']
        );

        $this->db->limit($data['limit'],  (int)($data['page'] - 1) * $data['limit']);
        $this->db->where('customer_id', $data['customer_id']);
        $this->db->like($data['filter']);
        $this->db->order_by($data['sort'], $data['dir']);
        $query = $this->db->get('customer_rent');
        return $query->result_array();
    }

    function getCustomerRentsTotal($data){
        $data = array(
            'customer_id' => (int)$data['customer_id'],
            'filter' => $data['filter']
        );
        $this->db->where('customer_id', $data['customer_id']);
        $this->db->like($data['filter']);
        return $this->db->count_all('customer_rent');
    }

    function addCustomerRent($data) {
        $this->db->insert('customer_rent', $data);
        return  $this->db->insert_id();
    }
}