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

//        if(empty($this->input->set_cookie('login_sessiontoken'))) {
//            echo '必须登录';exit;
//        }

        $this->admin_id = (int)$_SESSION['admin_id'];

        if(empty($_SESSION['admin_name'])) {
            echo '必须登录';exit;
        }
    }
}