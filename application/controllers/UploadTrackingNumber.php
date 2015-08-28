<?php
/**
 * Created by PhpStorm.
 * User: 周
 * Date: 2015/8/27
 * Time: 10:38
 */
defined('BASEPATH') OR exit('No direct script access allowed');

class UploadTrackingNumber extends AdminController {
    var $file_save_path = '';
    public function __construct() {
        parent::__construct();
        $this->load->model('file_upload_model');

        $this->load->model('customer_model');
        $this->load->model('customer_number_model');

        $this->load->model('customer_rent_model');
        $this->load->model('express_point_model');
        $this->load->model('tracking_number_model');
    }

    public function index() {
        //$this->load->view('upload_test');

//        if( preg_match('/^[0-9]+(\.[0-9]{1,3})?$/', '0.1234')) {
//            echo 'OK';
//        }

//        $express = $this->express_point_model->getOneByNameAndCode('深圳转运中心', '755901');
//        print_r($express);

        echo $this->tracking_number_model->importData(array());
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
        }
        else
        {
            $fileInfo = $this->upload->data();

            $fileData = array(
                'file_name' => $fileInfo['client_name'],
                'file_save_name' => $fileInfo['file_name'],
                'file_size' => $fileInfo['file_size'],
                'admin_id' => $this->admin_id
            );

            $this->file_upload_model->addFile($fileData);

            $this->file_save_path = FCPATH . $config['upload_path'] .$fileData['file_save_name'] ;

            $this->validateExcel($this->file_save_path);
        }
        exit;




    }

    public function validateExcel($file_path) {
        $pars_default = array(
            'sheetIndex' => 0,
            'headerKey' => TRUE,
            'readColumn' => array('运单号', '重量', '计费目的网点名称', '计费目的网点代码', '揽收时间')
        );
        try {
            $data = loadExcel($file_path, $pars_default);

            $msg = $this->tracking_number_model->validateData($data);

            if ($msg) {
                $json = array(
                    'success' => false,
                    'data' => $msg,
                    'total' => count($msg),
                    'msg' => '有错误',
                    'code' => ''
                );
                echo json_encode($json);
            } else {
                $json = array(
                    'success' => true,
                    'data' => [],
                    'total' => count($data),
                    'msg' => '成功',
                    'code' => '01'
                );
                echo json_encode($json);
            }
        } catch (Exception $e) {
            $json = array(
                'success' => false,
                'data' => [],
                'total' => 0,
                'msg' => $e->getMessage(),
                'code' => '89'
            );
            echo json_encode($json);
        }
    }
}