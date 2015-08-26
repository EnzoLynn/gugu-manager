<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Customer extends CI_Controller {

    public function index() {

    }

    public function getList() {
        $this->load->model('customer_model');

        $data = array(
            'page' => (int)$this->input->post('page'),
            'limit'=> (int)$this->input->post('limit'),
            'sort' => $this->input->post('sort'),
            'dir'  => $this->input->post('dir'),
            'filter' => json_decode($this->input->post('filter'))
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
        $this->load->model('customer_model');

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
            'customer_name' => $this->input->post('customer_name'),
            'real_name' => $this->input->post('real_name'),
            'mobile' => $this->input->post('mobile')
        );

        $this->customer_model->addCustomer($data);
    }
}





