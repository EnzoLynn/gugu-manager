<?php
/**
 * Created by PhpStorm.
 * User: 周
 * Date: 2015/8/27
 * Time: 10:38
 */
defined('BASEPATH') OR exit('No direct script access allowed');
//error_reporting(0);
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

//            echo '<script>console.log("上传完成，正在验证")</script><br />'.str_repeat(" ",256);
//            ob_flush();
//            flush();
//            sleep(1);

            $data = $this->validateExcel($this->file_save_path);

//            echo '<script>console.log("验证完成")</script><br />'.str_repeat(" ",256);
//            ob_flush();
//            flush();

            if ($data) {
                $num = $this->tracking_number_model->importData($data);
                $json = array(
                    'success' => true,
                    'data' => [],
                    'total' => $num,
                    'msg' => '成功',
                    'code' => '01'
                );
                echo json_encode($json);
            }
        }
        exit;
    }

    public function validateExcel($file_path) {
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
            $this->session_token_model->clearData($this->session_token, 'error_upload_tracking_file');
            return $data;
//            $json = array(
//                'success' => true,
//                'data' => [],
//                'total' => count($data),
//                'msg' => '成功',
//                'code' => '01'
//            );
//            echo json_encode($json);
        }
    }

    function downloadError() {
        $file = $this->session_token_model->getData($this->session_token, 'error_upload_tracking_file');
        if (!$file) {
            output_error('没有日志可供下载');
        }
        $pars_default = array(
            'sheetIndex' => 0,
            'headerKey' => TRUE,
            'readColumn' => array('运单号', '重量', '计费目的网点名称', '计费目的网点代码', '揽收时间', '快递公司')
        );

        $data = loadExcel($file, $pars_default);

        if (!$data) {
            //output_error('数据有问题，列都不匹配');
            $msg = array('数据有问题，列都不匹配');
            $header = array(
                //'tracking_number' => '运单号',
                'msg'   => '消息'
            );
            outputCVS($msg, $header);
        }

        $msg = $this->tracking_number_model->validateData($data);
        $header = array(
            //'tracking_number' => '运单号',
            'msg'   => '消息'
        );
        outputCVS($msg, $header);
    }
}