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
        $data = array(
            'customer_id' => $customer_id
        );
        $query = $this->db->select('*')->get_where('admin', $data);
        $admin = $query->fetch_row();
        return $admin;
    }

    function login($admin_name, $admin_pwd){
        $data = array(
            'admin_name' => $admin_name,
            'admin_pwd'  => $admin_pwd
        );
        $query = $this->db->select('admin_id,admin_name,is_admin')->get_where('admin', $data);
        $admin = $query->fetch_row();
        if($admin) {
            $this->setLogin($admin_name);
        }
        return $admin;
    }

    function setLogin($admin_name){
        $data = array(
            'admin_name' => $admin_name
        );
        $query = $this->db->select('admin_id,admin_name,is_admin')->get_where('admin', $data);
        $admin = $query->fetch_row();

        $this->CI->session->set_userdata($admin);
    }

    function logout(){
        $data = array(
            'admin_id' => '',
            'admin_name' => ''
        );
        $this->CI->session->unset_userdata($data);
        //redirect('/login');
    }
}