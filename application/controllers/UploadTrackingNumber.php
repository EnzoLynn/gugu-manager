<?php
/**
 * Created by PhpStorm.
 * User: 周
 * Date: 2015/8/27
 * Time: 10:38
 */
defined('BASEPATH') OR exit('No direct script access allowed');

class UploadTrackingNumber extends AdminController {
    public function __construct() {
        parent::__construct();
        $this->load->model('file_upload_model');

        $this->load->model('customer_model');

        $this->load->model('customer_rent_model');
        $this->load->model('customer_express_rule_model');
        $this->load->model('customer_express_rule_item_model');

        $this->load->model('express_rule_model');
        $this->load->model('express_rule_item_model');
    }

    public function index() {

    }

    public function upload() {
        $config['upload_path']      = './upload/excel/'.date('Ym');
        $config['allowed_types']    = 'xlsx|xls|cvs';
        $config['file_name']        = 'upload_'.date('YmdHis').rand(0,9).rand(0,9).rand(0,9);
        $config['max_size']          = 20480;
        $config['file_ext_tolower'] = TRUE;

        $this->load->library('upload', $config);

        if ( ! $this->upload->do_upload('fileUpload'))
        {
            $error = array('error' => $this->upload->display_errors());

            print_r($error);
        }
        else
        {
            $fileInfo = array('upload_data' => $this->upload->data());

            //print_r($fileInfo);

            $fileData = array(
                'file_name' => $fileInfo['client_name'],
                'file_save_name' => $fileInfo['file_name'],
                'file_size' => $fileInfo['file_size'],
                'admin_id' => $this->admin_id
            );

            $this->file_upload_model->addFile($fileData);


        }
        exit;



//        $filename = FCPATH . 'upload/excel/test_tracking_number.xlsx';//test2.xlsx
//
//        $pars_default = array(
//            'sheetIndex' => 0,
//            'headerKey' => TRUE,
//            'readColumn' => array('运单号', '重量', '计费目的网点名称', '计费目的网点代码', '揽收时间')
//        );
//
//        $data = loadExcel($filename, $pars_default);
//
//        echo '<pre>';
//        print_r($data);
    }

    public function validateExcel() {

    }
}