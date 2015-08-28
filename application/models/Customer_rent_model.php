<?php
/**
 * Created by PhpStorm.
 * User: 周
 * Date: 2015/8/24
 * Time: 15:35
 */


class Customer_rent_model extends CI_Model {
    function __construct() {
        parent::__construct();
    }

    function getCustomerRent($customer_rent_id) {
        if($customer_rent_id) {
            $this->db->where('customer_rent_id', $customer_rent_id);
            $query = $this->db->get('customer_rent');
            $customerRent = $query->fetch_row();
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
        $customerRent = $query->fetch_row();
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
}