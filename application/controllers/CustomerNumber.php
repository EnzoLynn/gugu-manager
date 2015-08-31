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
        $str = file_get_contents("php://input");
        $temp = json_decode($str);

        $post = objectToArray($temp);
        $data = array(
            'customer_id' => $post['customer_id'],
            'customize_number_prefix' => $post['customize_number_prefix'],
            'customize_number_from' => $post['customize_number_from'],
            'customize_number_to' => $post['customize_number_to'],
            'customize_number_suffix' => $post['customize_number_suffix']
        );

        $customer1 = $this->customer_number_model->getCustomerByTrackingNumber($data['customize_number_prefix'].$data['customize_number_from']);
        $customer2 = $this->customer_number_model->getCustomerByTrackingNumber($data['customize_number_prefix'].$data['customize_number_to']);

        if ($customer1) {
            output_error('该区间已被'.$customer1['customer_name'].'使用');
        }

        if ($customer2) {
            output_error('该区间已被'.$customer2['customer_name'].'使用');
        }

        $this->customer_number_model->addCustomerNumber($data);

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
        $str = file_get_contents("php://input");
        $temp = json_decode($str);
        $post = objectToArray($temp);
        //foreach($temp as $key => $val) {
            $number_id = $post['number_id'];
            $data = array(
                'customer_id' => $post['customer_id'],
                'customize_number_prefix' => $post['customize_number_prefix'],
                'customize_number_from' => $post['customize_number_from'],
                'customize_number_to' => $post['customize_number_to'],
                'customize_number_suffix' => $post['customize_number_suffix']
            );
            $this->customer_number_model->updateCustomerNumber($number_id, $data);
        //}

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
        $str = file_get_contents("php://input");
        $temp = json_decode($str);

        $post = objectToArray($temp);
        $number_id = $post['number_id'];
        $this->customer_number_model->deleteCustomerNumber($number_id);

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
