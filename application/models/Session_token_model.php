<?php
/**
 * Created by PhpStorm.
 * User: 周
 * Date: 2015/8/25
 * Time: 10:11
 */
class Session_token_model extends CI_Model {
    function __construct() {
        parent::__construct();
    }

    function setSession($data) {
        $session = $this->getSession($data['session_token']);
        if ($session) {
            $this->updateExpires($data['session_token']);
        } else {
            $data = array(
                'session_token' => $data['session_token'],
                'admin_id' => $data['admin_id'],
                'admin_name' => $data['admin_name'],
                'expires_time' => date('Y-m-d H:i:s'),
                'data' => ''//serialize($data['data'])
            );
            $this->db->insert('session_token', $data);
        }
        return $data['session_token'];
    }

    function getSession($session_token) {
        $this->clearSession();

        $data = array(
            'session_token' => $session_token
        );
        //$this->db->select('session_token,admin_id,admin_name,expires_time');
        $this->db->where($data);
        $query = $this->db->get('session_token');
        $session = $query->first_row();

        if (empty($session)) {
            return FALSE;
        }

        if (empty($session['data'])) {
            $session['data'] = array();
        } else {
            $session['data'] = unserialize($session['data']);
        }

        return $session;
    }

    function updateExpires($session_token) {
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
            return FALSE;
        }
    }

    function destroySession($session_token) {
        $this->db->where('session_token', $session_token);
        return $this->db->delete('session_token');
    }

    function clearSession() {
        $timer = strtotime('now');
        $timer = $timer - 60*60*2;//2小时以前
        $new_time = date('Y-m-d H:i:s', $timer);
        $this->db->where('expires_time <=' , $new_time);
        return $this->db->delete('session_token');
    }

    function saveData($session_token, $data) {
        $session = $this->getSession($session_token);
        if($session) {
            $timer = strtotime('now');
            $timer = $timer + 60*60*1;//一个小时

            $new_time = date('Y-m-d H:i:s', $timer);

            $upd_data = array(
                'data' => serialize($data),
                'expires_time' => $new_time
            );

            $this->db->where('session_token', $session_token);
            return $this->db->update('session_token', $upd_data);
        }
    }

    function addData($session_token, $data) {
        $session = $this->getSession($session_token);
        if($session) {
            $new_data = array_merge($session['data'], $data);

            $timer = strtotime('now');
            $timer = $timer + 60*60*1;//一个小时

            $new_time = date('Y-m-d H:i:s', $timer);

            $upd_data = array(
                'data' => serialize($new_data),
                'expires_time' => $new_time
            );

            $this->db->where('session_token', $session_token);
            return $this->db->update('session_token', $upd_data);
        }
    }

    function getData($session_token, $key) {
        $session = $this->getSession($session_token);
        if($session) {
            if (array_key_exists($key, $session['data'])) {
                return $session['data'][$key];
            }
        }
        return FALSE;
    }

    function clearData($session_token, $key) {
        $session = $this->getSession($session_token);
        if($session) {
            if (array_key_exists($key, $session['data'])) {
                unset($session['data'][$key]);
                $this->saveData($session_token, $session['data']);
            }
        }
        return FALSE;
    }
}