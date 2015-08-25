<?php
/**
 * Created by PhpStorm.
 * User: 周
 * Date: 2015/8/25
 * Time: 16:21
 */
defined('BASEPATH') OR exit('No direct script access allowed');

class CustomerNumber extends AdminController {

    public function index(){

    }

    public function getList(){
        $this->load->model('customer_number_model');

        $data = array(
            'page' => (int)$this->input->post('page'),
            'limit'=> (int)$this->input->post('limit'),
            'sort' => $this->input->post('sort'),
            'dir'  => $this->input->post('dir'),
            'filter' => json_decode($this->input->post('filter')),
            'customer_id' => (int)$this->input->post(customer_id)
        );
        $customer_numbers = $this->customer_number_model->getCustomerNumbers($data);

        $customer_numbers_total = $this->customer_number_model->getCustomerNumbersTotal((int)$this->input->post(customer_id));

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
        $this->load->model('customer_number_model');

        $data = array(
            'customer_id' => $this->input->post('customer_id'),
            'customize_number_prefix' => $this->input->post('customize_number_prefix'),
            'customize_number_from' => $this->input->post('customize_number_from'),
            'customize_number_to' => $this->input->post('customize_number_to'),
            'customize_number_suffix' => $this->input->post('customize_number_suffix')
        );

        $this->customer_model->addCustomerNumber($data);
    }
}
