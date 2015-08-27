<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Customer extends CI_Controller {

    public function __construct() {
        parent::__construct();
        $this->load->model('customer_model');
    }

    public function index() {

    }

    public function getList() {
        $data = array(
            'page' => (int)$this->input->post('page'),
            'limit'=> (int)$this->input->post('limit'),
            'sort' => $this->input->post('sort'),
            'dir'  => $this->input->post('dir'),
            'filter' => objectToArray(json_decode($this->input->post('filter')))
        );

        $customers = $this->customer_model->getCustomers($data);

        $customer_total = $this->customer_model->getCustomersTotal($data);

        $json = array(
            'success' => true,
            'data' => $customers,
            'total' => $customer_total,
            'msg' => '成功',
            'code' => '01'
        );
        echo json_encode($json);
    }

    public function add() {
        if($this->customer_model->existCustomerName($this->input->post('customer_name'))) {
            $json = array(
                'success' => false,
                'data' => [],
                'total' => 0,
                'msg' => '客户名已存在',
                'code' => '10'
            );
            echo json_encode($json);
            exit;
        }

        $data = array(
            'customer_name' => $this->input->get_post('customer_name'),
            'real_name' => $this->input->get_post('real_name'),
            'mobile' => $this->input->get_post('mobile')
        );

        $this->customer_model->addCustomer($data);
    }

    public function update() {
        $customer_id = $this->input->get_post('customer_name');

        $data = array(
            'customer_name' => $this->input->get_post('customer_name'),
            'real_name' => $this->input->get_post('real_name'),
            'mobile' => $this->input->get_post('mobile')
        );

        $this->customer_model->updateCustomer($customer_id, $data);
    }
}





