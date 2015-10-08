<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class TrackingFileUpload extends AdminController {

    var $status = array(
        '0' => '未验证',
        '2' => '验证中',
        '3' => '验证失败',
        '4' => '导入中',
        '5' => '导入失败',
        '1' => '导入成功'
    );

    public function __construct() {
        parent::__construct();
        $this->load->model('customer_model');
        $this->load->model('file_upload_model');

        $this->load->model('tracking_number_model');
        $this->load->model('task_model');
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
            'filter' => objectToArray(json_decode($this->input->post('filter')))
        );

        $files = $this->file_upload_model->getFiles($data);

        foreach ($files as $k => $v) {
            $files[$k]['admin_name'] = $this->admin_name;
            $files[$k]['status_name'] = $this->status[$v['status']];
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

    public function upload() {
        $config['upload_path']      = './upload/excel/'.date('Ym').'/';
        $config['allowed_types']    = 'xlsx|xls|cvs';
        $config['file_name']        = 'upload_'.date('YmdHis').rand(0,9).rand(0,9).rand(0,9);
        $config['max_size']          = 20480;
        $config['file_ext_tolower'] = TRUE;

        if(!is_dir(FCPATH . $config['upload_path'])) {
            mkdir(FCPATH . $config['upload_path']);
        }
        $this->load->library('upload', $config);

        if ( ! $this->upload->do_upload('fileUpload'))
        {
            $error = array('error' => $this->upload->display_errors());

            print_r($error);
            exit;
        }
        else {
            $fileInfo = $this->upload->data();

            $fileData = array(
                'file_name' => $fileInfo['client_name'],
                'file_save_name' => $fileInfo['file_name'],
                'file_size' => $fileInfo['file_size'],
                'admin_id' => $this->admin_id
            );

            //计算总条数
            $file_path = FCPATH . $config['upload_path'] . $fileData['file_save_name'];

//            $pars_default = array(
//                'sheetIndex' => 0,
//                'headerKey' => TRUE,
//                'readColumn' => array('运单号', '重量', '计费目的网点名称', '计费目的网点代码', '揽收时间', '快递公司')
//            );
//
//            $data = loadExcel($file_path, $pars_default);

            //插入数据
            //$fileData['item_total'] = 13000;//count($data);

            $this->file_upload_model->addFile($fileData);

            output_success();
        }
    }

    public function validate() {

        if (empty($file_id)) {
            $file_id = (int)$this->input->get_post('file_id');
        }
        $file_id = (int)$this->input->get_post('file_id');

        $file = $this->file_upload_model->getFile($file_id);

        if ($file['validate_progress'] == 3) {
            output_error('验证中，不要重复该任务');
        }

        $file_dir      = './upload/excel/'.date('Ym', strtotime($file['created_at'])).'/';

        $file_path = FCPATH . $file_dir . $file['file_save_name'];

        if (!file_exists($file_path)) {
            output_error('文件不存在');
        }

        //状态改为验证中
        $upd_data = array(
            'status' => 2
        );
        $this->file_upload_model->update($file_id, $upd_data);

        $task = array(
            'file_id' => $file_id,
            'type'    => 0,//0为验证，1为导入
            'status' => 0//0新任务，2进行中任务，1完成任务
        );
        $this->task_model->add($task);

        output_success('验证任务已加入到后台队列');
    }

    public function downloadError() {
        $file_id = (int)$this->input->get_post('file_id');
        $file = $this->file_upload_model->getFile($file_id);

        $file_dir      = './upload/excel/'.date('Ym', strtotime($file['created_at'])).'/';

        $tempName = explode('.', $file['file_save_name']);
        $err_file = FCPATH . $file_dir . $tempName[0] .'_error.csv';

        downloadCSV($err_file);
    }

    public function delete() {
        $file_id = (int)$this->input->get_post('file_ids');
        $file = $this->file_upload_model->getFile($file_id);

        if ($file['import_status'] == 1) {
            output_error('导入成功的文件不能删除');
        }

        $file_dir      = './upload/excel/'.date('Ym', strtotime($file['created_at'])).'/';
        $file_path = FCPATH . $file_dir . $file['file_save_name'];

        $tempName = explode('.', $file['file_save_name']);
        $err_file = FCPATH . $file_dir . $tempName[0] .'_error.csv';

        $this->file_upload_model->delete($file_id);

        if (file_exists($err_file)) {
            unlink($err_file);
        }

        if (file_exists($file_path)) {
            unlink($file_path);
        }
        output_success();
    }

    public function getLastImportFile() {
        $limit = (int)$this->input->get_post('limit');
        if ($limit == 0) {
            $limit = 20;
        }
        $data = array(
            'page' => 1,
            'limit'=> $limit,
            'sort' => 'created_at',
            'dir'  => 'DESC',
            'filter' => array(
                'import_status' => 1
            )
        );
        $files = $this->file_upload_model->getFiles($data);
        $json = array(
            'success' => true,
            'data' => $files,
            'total' => $limit,
            'msg' => '成功',
            'code' => '01'
        );
        echo json_encode($json);
    }

//    public function getProgress() {
//        $file_id = (int)$this->input->get_post('file_id');
//        $file = $this->file_upload_model->getFile($file_id);
//
//        $json = array(
//            'success' => true,
//            'data' => array(
//                'file_id'  => $file['file_id'],
//                'current' => $file['validate_progress'],
//                //'import' => $file['import_progress'],
//                'total' => $file['item_total'],
//            ),
//            'total' => $file['item_total'],
//            'msg' => '成功',
//            'code' => '01'
//        );
//        echo json_encode($json);
//        exit;
//    }
}