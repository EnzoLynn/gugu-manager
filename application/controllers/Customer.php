<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Customer extends CI_Controller {

    public function __construct() {
        parent::__construct();
        $this->load->model('customer_model');
        $this->load->model('customer_rent_model');
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
        $rows = $this->customer_model->getCustomers($data);
        $customers = array();
        foreach ($rows as $key=>$val) {
            $customerRent = $this->customer_rent_model->getCustomerRent($val['customer_rent_id']);
            if($customerRent) {
                $customer_rent = array(
                    'title' => $customerRent['title'],
                    'rent_area' => $customerRent['rent_area'],
                    'area_to_order_number' => $customerRent['area_to_order_number'],
                    'rent_pre_price' => $customerRent['rent_pre_price'],
                    'date_start' => $customerRent['date_start'],
                    'date_end' => $customerRent['date_end']
                );
                $customers[$key] = array_merge($val, $customer_rent);
            }else {
                $customers[$key] = $val;
            }
        }
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





