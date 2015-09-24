<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class TrackingFileUpload extends AdminController {
    public function __construct() {
        parent::__construct();
        $this->load->model('customer_model');
        $this->load->model('file_upload_model');

        $this->load->model('tracking_number_model');
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
            if ($v['validate_status'] == 0) {
                $files[$k]['validate_status_name'] = '未验证';
            } else if ($v['validate_status'] == 2) {
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

    public function upload() {
        $config['upload_path']      = './upload/excel/'.date('Ym').'/';
        $config['allowed_types']    = 'xlsx|xls|cvs';
        $config['file_name']        = 'upload_'.date('YmdHis').rand(0,9).rand(0,9).rand(0,9);
        $config['max_size']          = 20480;
        $config['file_ext_tolower'] = TRUE;

        if(!is_dir($config['upload_path'])) {
            mkdir($config['upload_path']);
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

            $this->file_upload_model->addFile($fileData);

            $this->file_save_path = FCPATH . $config['upload_path'] . $fileData['file_save_name'];
            output_success();
        }
    }

    public function validate() {
        $file_id = (int)$this->input->get_post('file_id');
        $file = $this->file_upload_model->getFile($file_id);

        $file_dir      = './upload/excel/'.date('Ym', strtotime($file['created_at'])).'/';

        $file_path = FCPATH . $file_dir . $file['file_save_name'];

        //public function validateExcel($file_path) {
        $pars_default = array(
            'sheetIndex' => 0,
            'headerKey' => TRUE,
            'readColumn' => array('运单号', '重量', '计费目的网点名称', '计费目的网点代码', '揽收时间', '快递公司')
        );

        $data = loadExcel($file_path, $pars_default);

        if (!$data) {
            $json = array(
                'success' => false,
                'data' => array('msg' => 'excel没有数据匹配'),
                'total' => 0,
                'msg' => 'excel没有数据匹配',
                'code' => '89'
            );
            echo json_encode($json);
            exit;
        }

        $repeat_number = $this->tracking_number_model->checkExcelField($data, '运单号');

        if ($repeat_number) {
            $msg = array();
            foreach ($repeat_number as $number) {
                $msg[] = array(
                    'msg' => 'Excel内部重复的运单号：' . $number
                );
            }
            $json = array(
                'success' => false,
                'data' => $msg,
                'total' => 1,
                'msg' => '数据有问题',
                'code' => '89'
            );
            echo json_encode($json);
            exit;
        }

        $msg = $this->tracking_number_model->validateData($data);

        if ($msg) {
            $temp = array(
                'error_upload_tracking_file' => $file_path
            );
            $this->session_token_model->addData($this->session_token, $temp);

            $json = array(
                'success' => false,
                'data' => $msg,
                'total' => count($msg),
                'msg' => '数据有问题',
                'code' => '89'
            );
            echo json_encode($json);
            exit;
        } else {
//            $this->session_token_model->clearData($this->session_token, 'error_upload_tracking_file');
//            return $data;
            output_success();
        }

    }

    public function import() {
        $file_id = (int)$this->input->get_post('file_id');
        $this->file_upload_model->getFile($file_id);
    }

    public function downloadError() {
        $file_id = (int)$this->input->get_post('file_id');
        $this->file_upload_model->getFile($file_id);
    }




}