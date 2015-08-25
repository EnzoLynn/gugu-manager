<?php
defined('BASEPATH') OR exit('No direct script access allowed');
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2015/8/20
 * Time: 17:11
 */

class MY_Controller extends CI_Controller{
    public function __construct(){
        parent::__construct();
        $this->load->helper('cookie');
    }
}
//后台控制器
class AdminController extends MY_Controller
{
    var $admin_id = 0;

    public function __construct()
    {
        parent::__construct();

        $admin = array();

        if($this->input->get_post('sessiontoken')){
            $session = $this->session_token_model->getSession($this->input->get_post('sessiontoken'));

            if($session) {
                $admin = $this->admin_model->getAdmin($session['admin_name']);
            }
        }
        if(!$admin) {
            $json = array(
                'success' => false,
                'msg' => '帐号或者密码错误',
                'code' => 99
            );
            echo json_encode($json);
            exit;
        }
    }
}