<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Login extends CI_Controller {

    public function index()
    {
        $this->load->view('login');
    }

    public function ajaxLogin(){
        $this->load->model('admin_model');
        $admin_name = $this->input->post('admin_name');
        $admin_pwd = $this->input->post('admin_pwd');
        $admin = $this->admin_model->login($admin_name, $admin_pwd);

        if($admin) {
            $this->input->set_cookie('login_sessiontoken',$admin['admin_id'], 60*60*24);
            $this->input->set_cookie('login_username',$admin['admin_name'], 60*60*24);

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
                'msg' => '帐号或者密码错误'
            );
        }
        //echo '<pre>';print_r($json);exit;
        return urldecode(json_encode($json));
    }
}
