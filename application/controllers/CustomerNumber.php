<?php
/**
 * Created by PhpStorm.
 * User: 周
 * Date: 2015/8/25
 * Time: 16:21
 */
defined('BASEPATH') OR exit('No direct script access allowed');

class CustomerNumber extends AdminController {

    public function __construct() {
        parent::__construct();
        $this->load->model('customer_model');
        $this->load->model('customer_number_model');
        $this->load->model('file_upload_model');
    }

    public function index() {

    }

    public function getList() {
        $data = array(
            'page' => (int)$this->input->post('page'),
            'limit'=> (int)$this->input->post('limit'),
            'sort' => $this->input->post('sort'),
            'dir'  => $this->input->post('dir'),
            'filter' => objectToArray(json_decode($this->input->post('filter'))),
            'customer_id' => (int)$this->input->post('customer_id')
        );
        if (isset($data['filter']['use_time'])) {
            $temp = explode(',', $data['filter']['use_time']);
            $data['filter']['use_time_begin'] = $temp[0];
            $data['filter']['use_time_end'] = $temp[1];
        }
        $customer_numbers = $this->customer_number_model->getCustomerNumbers($data);
        foreach ($customer_numbers as $k => $v) {
            if ($v['use_status'] == 0) {
                $customer_numbers[$k]['use_status_name'] = '未用';
            } else {
                $customer_numbers[$k]['use_status_name'] = '已用';
            }
            $customer = $this->customer_model->getCustomer($v['customer_id']);
            $customer_numbers[$k]['customer_name'] = $customer['customer_name'];
        }

        $customer_numbers_total = $this->customer_number_model->getCustomerNumbersTotal($data);

        $json = array(
            'success' => true,
            'data' => $customer_numbers,
            'total' => $customer_numbers_total,
            'msg' => '成功',
            'code' => '01'
        );
        echo json_encode($json);
    }

    public function add() {
        $customer_id = $this->input->post('customer_id');
        //$tracking_number_prefix = $this->input->post('tracking_number_prefix');
        $tracking_number_start = strtoupper($this->input->post('tracking_number_start'));
        $tracking_number_end = strtoupper($this->input->post('tracking_number_end'));

        $customer1 = $this->customer_number_model->getCustomerByTrackingNumber($tracking_number_start);
        $customer2 = $this->customer_number_model->getCustomerByTrackingNumber($tracking_number_end);

        if ($customer1) {
            output_error('该区间已被'.$customer1['customer_name'].'使用');
        }

        if ($customer2) {
            output_error('该区间已被'.$customer2['customer_name'].'使用');
        }

        $numbers = getArrayByBetween($tracking_number_start, $tracking_number_end);

        if (!$numbers) {
            output_error('区间填写错误，没有生成相关单号');
        }
        foreach ($numbers as $number) {
            $data = array(
                'customer_id' => $customer_id,
                'tracking_number' => $number
            );
            $this->customer_number_model->addCustomerNumber($data);
        }

        $json = array(
            'success' => true,
            'data' => [],
            'total' => 1,
            'msg' => '成功',
            'code' => '01'
        );
        echo json_encode($json);
    }

    public function update() {
        //不能修改
        $json = array(
            'success' => true,
            'data' => [],
            'total' => 1,
            'msg' => '成功',
            'code' => '01'
        );
        echo json_encode($json);
    }

    public function delete() {
        $number_ids = explode(',',$this->input->post('number_ids'));
        foreach ($number_ids as $number_id) {
            $this->customer_number_model->deleteCustomerNumber($number_id);
        }
        $json = array(
            'success' => true,
            'data' => [],
            'total' => 1,
            'msg' => '成功',
            'code' => '01'
        );
        echo json_encode($json);
    }
    //上传excel
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

            $data = $this->validateExcel($this->file_save_path);

            if ($data) {
                $num = $this->customer_number_model->importData($data);
                output_success();
            }
        }
        exit;
    }

    public function validateExcel($file_path) {
        $pars_default = array(
            'sheetIndex' => 0,
            'headerKey' => TRUE,
            'readColumn' => array('运单号码', '商家代码', '快递公司')
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

        $msg = $this->customer_number_model->validateData($data);

        if ($msg) {
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
            return $data;
        }
    }
}
