<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Login extends CI_Controller {

    public function index()
    {
        $this->load->view('login');
    }

    public function ajaxLogin(){

        if($_COOKIE['login_sessiontoken'] == session_id() ) {

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

        $admin_name = $this->input->post('admin_name');
        $admin_pwd = $this->input->post('admin_pwd');
        $admin = $this->admin_model->login($admin_name, $admin_pwd);

        if($admin) {
            $_SESSION['admin_id'] = $admin['admin_id'];
            $_SESSION['admin_name'] = $admin['admin_name'];
            $this->input->set_cookie('login_sessiontoken', session_id(), 60*60*24);
            $this->input->set_cookie('login_username', $admin['admin_name'], 60*60*24);

            $json = array(
                'success' => true,
                'data' => $admin,
                'total' => 1,
                'msg' => '登录成功',
                'code' => '01'
            );
        }else {
            $json = array(
                'success' => false,
                'msg' => '帐号或者密码错误',
                'code' => 99
            );
        }
        //echo '<pre>';print_r($json);exit;
        echo json_encode($json);
    }

    public function heartbeat() {
        if($_COOKIE['login_sessiontoken'] == session_id() ) {
            $json = array(
                'success' => true,
                'data' => [],
                'total' => 1,
                'msg' => '成功',
                'code' => '01'
            );
        }else{
            $json = array(
                'success' => false,
                'msg' => '帐号或者密码错误',
                'code' => 99
            );
        }
        echo json_encode($json);
    }
}
