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
    var $admin_name = '';
    var $session_token = '';
    var $time_begin = 0;//开始运行的时间

    public function __construct()
    {
        parent::__construct();

        $this->time_begin = time();
        //设置头部为json
        //$this->output->set_content_type('application/json', strtolower($this->config->item('charset')));

        $admin = array();

        if($this->input->get_post('sessiontoken')){
            $session = $this->session_token_model->getSession($this->input->get_post('sessiontoken'));
            $this->session_token = $this->input->get_post('sessiontoken');
            if($session) {
                $this->admin_id = $session['admin_id'];
                $this->admin_name = $session['admin_name'];
                $where = array(
                    'admin_name' => $session['admin_name']
                );
                $admin = $this->admin_model->getOne($where);
            }else{
                delete_cookie('login_sessiontoken');
            }
        }
        if(!$admin) {
            $json = array(
                'success' => false,
                'msg' => '请重新登录',
                'code' => 99
            );
            echo json_encode($json);
            exit;
        }
    }

    public function write_log($msg) {

    }

    //显示运行时间
    function show_runtime($msg = '') {
        $now = time();
        $mic = ($now - $this->time_begin);
        echo $mic/1000 . ' 秒<br/>';
    }
}