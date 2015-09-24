<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class TrackingFileUpload extends AdminController {
    public function __construct() {
        parent::__construct();
        $this->load->model('customer_model');
        $this->load->model('file_upload_model');
    }

    public function index() {

    }

    public function getOne() {

    }

    public function getList() {
        $data = array(
            'page' => (int)$this->input->post('page'),
            'limit' => (int)$this->input->post('limit'),
            'sort' => $this->input->post('sort'),
            'dir' => $this->input->post('dir'),
            'filter' => json_decode($this->input->post('filter'))
        );

        $files = $this->file_upload_model->getFiles($data);

        foreach ($files as $k => $v) {
            $files[$k]['admin_name'] = $this->admin_name;
            if ($v['validate_status'] == 0) {
                $files[$k]['validate_status_name'] = '未通过';
            } else {
                $files[$k]['validate_status_name'] = '验证通过';
            }
            if ($v['import_status'] == 0) {
                $files[$k]['import_status_name'] = '未导入';
            } else {
                $files[$k]['import_status_name'] = '已导入';
            }
        }

        $files_total = $this->file_upload_model->getFilesTotal($data);

        $json = array(
            'success' => true,
            'data' => $files,
            'total' => $files_total,
            'msg' => '成功',
            'code' => '01'
        );
        echo json_encode($json);
    }
}