<?php
/**
 * Created by PhpStorm.
 * User: 周
 * Date: 2015/8/25
 * Time: 16:21
 */
defined('BASEPATH') OR exit('No direct script access allowed');

class CustomerNumber extends AdminController {

    public function __construct(){
        parent::__construct();
        $this->load->model('customer_number_model');
    }

    public function index(){

    }

    public function getList(){
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
        $data = array(
            'customer_id' => $this->input->get_post('customer_id'),
            'customize_number_prefix' => $this->input->get_post('customize_number_prefix'),
            'customize_number_from' => $this->input->get_post('customize_number_from'),
            'customize_number_to' => $this->input->get_post('customize_number_to'),
            'customize_number_suffix' => $this->input->get_post('customize_number_suffix')
        );

        print_r($_POST);
        print_r($data);exit;

        $this->customer_number_model->addCustomerNumber($data);
        $json = array(
            'success' => true,
            'data' => [],
            'total' => 1,
            'msg' => '成功',
            'code' => '01'
        );
        //echo json_encode($json);
        echo 111;exit;
    }

    public function update() {
        $number_id = $this->input->post('number_id');
        $data = array(
            'customer_id' => $this->input->post('customer_id'),
            'customize_number_prefix' => $this->input->post('customize_number_prefix'),
            'customize_number_from' => $this->input->post('customize_number_from'),
            'customize_number_to' => $this->input->post('customize_number_to'),
            'customize_number_suffix' => $this->input->post('customize_number_suffix')
        );

        $this->customer_number_model->updateCustomerNumber($number_id, $data);
    }

    public function delete() {
        $number_id = $this->input->post('number_id');
        $this->customer_number_model->deleteCustomerNumber($number_id);
    }
}
