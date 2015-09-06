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
        $this->load->model('customer_number_model');
    }

    public function index() {

    }

    public function getList() {
        $data = array(
            'page' => (int)$this->input->post('page'),
            'limit'=> (int)$this->input->post('limit'),
            'sort' => $this->input->post('sort'),
            'dir'  => $this->input->post('dir'),
            //'filter' => json_decode($this->input->post('filter')),
            'customer_id' => (int)$this->input->post('customer_id')
        );
        $customer_numbers = $this->customer_number_model->getCustomerNumbers($data);

        $customer_numbers_total = $this->customer_number_model->getCustomerNumbersTotal($data['customer_id']);

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
        $tracking_number_start = $this->input->post('tracking_number_start');
        $tracking_number_end = $this->input->post('tracking_number_end');

        $customer1 = $this->customer_number_model->getCustomerByTrackingNumber($tracking_number_start);
        $customer2 = $this->customer_number_model->getCustomerByTrackingNumber($tracking_number_end);

        if ($customer1) {
            output_error('该区间已被'.$customer1['customer_name'].'使用');
        }

        if ($customer2) {
            output_error('该区间已被'.$customer2['customer_name'].'使用');
        }

        $numbers = getArrayByBetween($tracking_number_start, $tracking_number_end);

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
}
