<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Login extends MY_Controller {

    public function index() {
        $this->load->view('login');
    }

    public function ajaxLogin() {
        $admin = array();  
        if($this->input->post('admin_name') && $this->input->post('admin_pwd')) {
            $admin_name = $this->input->post('admin_name');
            $admin_pwd = $this->input->post('admin_pwd');
            $where = array(
                'admin_name' => $admin_name,
                'admin_pwd'  => $admin_pwd
            );
            $admin = $this->admin_model->getOne($where);
        }else if($this->input->get_post('sessiontoken')){
            $session = $this->session_token_model->getSession($this->input->get_post('sessiontoken'));
            if(!empty($session) > 0) {
                $where = array(
                    'admin_name' => $session['admin_name']
                );
                $admin = $this->admin_model->getOne($where);
            }else{
                delete_cookie('login_sessiontoken');
                $json = array(
                    'success' => false,
                    'msg' => '登录信息失效',
                    'code' => 99
                );
                echo json_encode($json);
                exit;
            }
        } else {
            $json = array(
                'success' => false,
                'msg' => '登录信息失效',
                'code' => 99
            );
            echo json_encode($json);
            exit;
        }

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
                'data' => $data,
                'total' => 1,
                'msg' => '登录成功',
                'code' => '01'
            );
        }else {
            $json = array(
                'success' => false,
                'msg' => '帐号或者密码错误',
                'code' => 0
            );
        }
        header('Content-type: application/json');
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
            'msg' => '登录信息失效',
            'code' => 99
        );
        echo json_encode($json);
    }

    public function logout() {
        $sessionToken = $this->input->get_post('sessiontoken');
        $this->session_token_model->destroySession($sessionToken);
        $json = array(
            'success' => true,
            'data' => [],
            'total' => 1,
            'msg' => '成功',
            'code' => '01'
        );
        delete_cookie('login_sessiontoken');
        delete_cookie('login_username');
        echo json_encode($json);exit;
    }
}
