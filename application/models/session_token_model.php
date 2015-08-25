<?php
/**
 * Created by PhpStorm.
 * User: 周
 * Date: 2015/8/25
 * Time: 10:11
 */
class Session_token_model extends CI_Model
{
    function __construct()
    {
        parent::__construct();
    }

    function setSession($data)
    {
        $session = $this->getSession($data['session_token']);
        if ($session) {
            $this->updateExpires($data['session_token']);
        } else {
            $data = array(
                'session_token' => $data['session_token'],
                'admin_id' => $data['admin_id'],
                'admin_name' => $data['admin_name'],
                'expires_time' => date('Y-m-d H:i:s')
            );
            $this->db->insert('session_token', $data);
        }
        return $data['session_token'];
    }

    function getSession($session_token){
        $data = array(
            'session_token' => $session_token
        );
        $this->db->select('session_token,admin_id,admin_name,expires_time');
        $this->db->where($data);
        $query = $this->db->get('session_token');
        $session = $query->fetch_row();

        return $session;
    }

    function updateExpires($session_token){
        $this->clearSession();

        $data = array(
            'session_token' => $session_token
        );

        $session = $this->getSession($session_token);
        if($session) {
            $timer = strtotime('now');
            $timer = $timer + 60*60*1;//一个小时

            $new_time = date('Y-m-d H:i:s', $timer);
            $this->db->where($data);
            $this->db->update('session_token', array('expires_time' => $new_time));
        }else{
            //要求重新登录
        }
    }

    function destroySession($session_token){
        $data = array(
            'session_token' => $session_token
        );
        $this->db->where($data);
        return $this->db->delete('session_token');
    }

    function clearSession() {
        $timer = strtotime('now');
        $timer = $timer - 60*60*24*2;//两天以前
        $new_time = date('Y-m-d H:i:s', $timer);
        $this->db->where('expires_time <=', $new_time);
        return $this->db->delete('session_token');
    }
}