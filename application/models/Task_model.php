<?php
/**
 * Created by PhpStorm.
 * User: 周
 * Date: 2015/9/28
 * Time: 15:35
 */


class Task_model extends CI_Model{
    var $CI;
    public function __construct(){
        parent::__construct();
        $this->CI = &get_instance();
        $this->CI->load->model('file_upload_model');
    }

    function getNewTask() {
        $this->db->where('status', 0);
        $this->db->order_by('task_id', 'DESC');
        $query = $this->db->get('task');
        return $query->first_row();
    }

    function add($data) {
        $task = array(
            'file_id' => $data['file_id'],
            'status'  => 0,//0新任务，2进行中任务，1完成任务
            'created_at'    => date('Y-m-d H:i:s'),
            'updated_at'    => date('Y-m-d H:i:s')
        );

        $this->db->where('file_id', $data['file_id']);
        $num = $this->db->count_all_results('task');
        if ($num == 0) {
            $this->db->insert('task', $task);
            $task_id =  $this->db->insert_id();
            return $task_id;
        }
    }

    function update($task_id, $status) {
        $task = array(
            'status'  => $status,//0新任务，2进行中任务，1完成任务
            'updated_at'    => date('Y-m-d H:i:s')
        );
        $this->db->where('task_id', $task_id);
        return $this->db->update('task', $task);
    }
}