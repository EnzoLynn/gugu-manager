<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Login extends MY_Controller {

    public function index()
    {
        $this->load->view('login');
    }

    public function ajaxLogin() {
        $admin = array();
        if($this->input->post('admin_name') && $this->input->post('admin_pwd')) {
            $admin_name = $this->input->post('admin_name');
            $admin_pwd = $this->input->post('admin_pwd');
            $admin = $this->admin_model->login($admin_name, $admin_pwd);
        }else if($this->input->get_post('sessiontoken')){
            $session = $this->session_token_model->getSession($this->input->get_post('sessiontoken'));
            $admin = $this->admin_model->getAdmin($session['admin_name']);
        }

//
//            $json = array(
//                'success' => false,
//                'total' => 1,
//                'msg' => $_SESSION['admin_name'],
//                'code' => 'aaa'
//            );
//            echo json_encode($json);exit;

        if($admin) {
            $data = array(
                'session_token' => session_id(),
                'admin_id' => $admin['admin_id'],
                'admin_name' => $admin['admin_name'],
                'expires_time' => date('Y-m-d H:i:s', time() + 60*60)
            );
            $this->session_token_model->setSession($data);

            set_cookie('login_sessiontoken', session_id(), 60*60*24);
            set_cookie('login_username', $admin['admin_name'], 60*60*24);

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

        $sessionToken = $this->input->get_post('sessiontoken');
        if ($sessionToken) {
            $session = $this->session_token_model->getSession($sessionToken);
            if($session) {
                $this->session_token_model->updateExpires($sessionToken);

                $json = array(
                    'success' => true,
                    'data' => [],
                    'total' => 1,
                    'msg' => '成功',
                    'code' => '01'
                );
                echo json_encode($json);exit;

            }else{
                //没有
            }
        }
        $json = array(
            'success' => false,
            'msg' => '帐号或者密码错误',
            'code' => 99
        );
        echo json_encode($json);
    }
}
