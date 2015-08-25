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
    }
}
//后台控制器
class AdminController extends MY_Controller
{
    var $admin_id = 0;

    public function __construct()
    {
        parent::__construct();

//        if($this->input->cookie('login_sessiontoken') != session_id() ) {
//            $json = array(
//                'success' => false,
//                'msg' => '请重新登录',
//                'code' => 99
//            );
//            echo json_encode($json);
//            exit;
//        }



        //$this->admin_id = (int)$_SESSION['admin_id'];

//        if(empty($_SESSION['admin_name'])) {
//            redirect('/login.html');
//        }
    }
}