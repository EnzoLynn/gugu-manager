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
    var $admin_id;

    public function __construct()
    {
        parent::__construct();

        $this->admin_id = (int)$_SESSION['admin_id'];

        if($this->input->cookie('login_sessiontoken') == session_id() ) {
            $admin = $this->admin_model->getAdmin($_SESSION['admin_name']);
            $json = array(
                'success' => true,
                'data' => $admin,
                'total' => 1,
                'msg' => '登录成功',
                'code' => '01'
            );
            echo json_encode($json);
            exit;
        }

        $json = array(
            'success' => false,
            'msg' => '请重新登录',
            'code' => 99
        );
        echo json_encode($json);
        exit;

        //$this->admin_id = (int)$_SESSION['admin_id'];

//        if(empty($_SESSION['admin_name'])) {
//            redirect('/login.html');
//        }
    }
}