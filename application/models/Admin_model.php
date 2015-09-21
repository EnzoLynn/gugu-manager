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

    function getOne($cond) {
        foreach ($cond as $field => $value) {
            $this->db->where($field, $value);
        }
        $query = $this->db->get('admin');
        $admin = $query->first_row();
        return $admin;
    }
}