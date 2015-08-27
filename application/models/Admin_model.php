<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2015/8/21
 * Time: 11:36
 */

class Admin_model extends CI_Model{
    var $CI;
    function __construct() {
        parent::__construct();
        $this->CI = &get_instance();
    }

    function getAdmin($admin_name){
        $data = array(
            'admin_name' => $admin_name
        );
        $this->db->select('admin_id,admin_name,is_admin');
        $this->db->where($data);
        $query = $this->db->get('admin');
        $admin = $query->first_row();
        return $admin;
    }

    function login($admin_name, $admin_pwd) {
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

    function setLogin($admin_name) {
        $data = array(
            'admin_name' => $admin_name
        );
        $query = $this->db->select('admin_id,admin_name,is_admin')->get_where('admin', $data);
        $admin = $query->fetch_row();

        $this->CI->session->set_userdata($admin);
    }
}