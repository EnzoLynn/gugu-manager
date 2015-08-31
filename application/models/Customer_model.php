<?php
/**
 * Created by PhpStorm.
 * User: 周
 * Date: 2015/8/24
 * Time: 15:35
 */


class Customer_model extends CI_Model{
    var $CI;
    public function __construct(){
        parent::__construct();
        $this->CI = &get_instance();
        $this->CI->load->model('customer_rent_model');
    }

    function getCustomer($customer_id){
        $this->db->where('customer_id', $customer_id);
        $query = $this->db->get('customer');
        return $query->first_row();
    }

    function getCustomers($data){
        $data = array(
            'page' => (int)$data['page'],
            'limit'=> (int)$data['limit'],
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
//        $data = array(
//            'filter' => $data['filter']
//        );
        $this->db->like($data['filter']);
        return $this->db->count_all_results('customer');
    }

    function addCustomer($data) {
        $customer = array(
            'customer_name' => $data['customer_name'],
            'real_name'  => $data['real_name'],
            'mobile'    => $data['mobile']
        );
        $this->db->insert('customer', $customer);
        $customer_id =  $this->db->insert_id();
        return $customer_id;
    }

    function addCustomerAndRent($data) {
        $customer = array(
            'customer_name'     => $data['customer_name'],
            'real_name'     => $data['real_name'],
            'mobile'        => $data['mobile'],
            'customer_rent_id' => 0,
        );
        $this->db->insert('customer', $customer);
        $customer_id =  $this->db->insert_id();

        $customer_rent = array(
            'customer_id' => $customer_id,
            'title'        => $data['title'],
            'rent_area'   => $data['rent_area'],
            'area_to_order_number' => $data['area_to_order_number'],
            'rent_pre_price'        => $data['rent_pre_price'],
            'date_start'            => $data['date_start'],
            'date_end'              => $data['date_end']
        );
        $this->db->insert('customer_rent', $customer_rent);
        $customer_rent_id =  $this->db->insert_id();

        $this->db->update('customer', array('customer_rent_id' => $customer_rent_id))->where('customer_id', $customer_id);
        return $customer_id;
    }

    function updateCustomer($customer_id, $data) {
        $this->db->where('customer_id', $customer_id);
        return $this->db->update('customer', $data);
    }

    function existCustomerName($customer_name) {
        $this->db->where('customer_name', $customer_name);
        $query = $this->db->get('customer');
        if($query->num_rows() == 0 ){
            return FALSE;
        }else {
            return TRUE;
        }
    }
}