<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class CustomerRent extends AdminController {

    public function __construct() {
        parent::__construct();
        $this->load->model('customer_model');
        $this->load->model('customer_rent_model');
    }

    public function index() {

    }

    public function getOne() {

    }

    public function getList() {
        $data = array(
            'page' => (int)$this->input->post('page'),
            'limit'=> (int)$this->input->post('limit'),
            'sort' => $this->input->post('sort'),
            'dir'  => $this->input->post('dir'),
            'filter' => json_decode($this->input->post('filter')),
            'customer_id' => (int)$this->input->post('customer_id')
        );

        $customer = $this->customer_model->getCustomer((int)$this->input->post('customer_id'));

        $customer_rents = $this->customer_rent_model->getCustomerRents($data);
        foreach ($customer_rents as $k => $v) {
            if ($v['customer_rent_id'] == $customer['customer_rent_id']) {
                $customer_rents[$k]['status'] = '有效';
            } else {
                $customer_rents[$k]['status'] = '无效';
            }
        }

        $customer_rents_total = $this->customer_rent_model->getCustomerRentsTotal($data);

        $json = array(
            'success' => true,
            'data' => $customer_rents,
            'total' => $customer_rents_total,
            'msg' => '成功',
            'code' => '01'
        );
        echo json_encode($json);
    }

    public function add() {
        $sign = $this->customer_rent_model->existRentNo($this->input->post('rent_no'), 0);
        if ($sign) {
            $json = array(
                'success' => false,
                'data' => [],
                'total' => 0,
                'msg' => '合同编号重复',
                'code' => '01'
            );
            echo json_encode($json);
            exit;
        }
        $customer_id = $this->input->post('customer_id');
        $data = array(
            'customer_id' => $customer_id,
            'rent_no' => $this->input->post('rent_no'),
            'title' => $this->input->post('title'),
            'rent_area' => $this->input->post('rent_area'),
            'area_to_order_number' => $this->input->post('area_to_order_number'),
            'rent_pre_price' => $this->input->post('rent_pre_price'),
            'date_start' => $this->input->post('date_start'),
            'date_end' => $this->input->post('date_end')
        );

        $customer_rent_id = $this->customer_rent_model->addCustomerRent($data);

        $data = array(
            'customer_rent_id' => $customer_rent_id
        );

        $this->customer_model->updateCustomer($customer_id, $data);
    }

    public function update() {
        $customer_rent_id = $this->input->post('customer_rent_id');
        $sign = $this->customer_rent_model->existRentNo($this->input->post('rent_no'), $customer_rent_id);
        if ($sign) {
            $json = array(
                'success' => false,
                'data' => [],
                'total' => 0,
                'msg' => '合同编号重复',
                'code' => '01'
            );
            echo json_encode($json);
            exit;
        }
        $data = array(
            'customer_id' => $this->input->post('customer_id'),
            'rent_no' => $this->input->post('rent_no'),
            'title' => $this->input->post('title'),
            'rent_area' => $this->input->post('rent_area'),
            'area_to_order_number' => $this->input->post('area_to_order_number'),
            'rent_pre_price' => $this->input->post('rent_pre_price'),
            'date_start' => $this->input->post('date_start'),
            'date_end' => $this->input->post('date_end')
        );

        $this->customer_rent_model->updateCustomer($data);
    }

    public function delete() {
        $customer_rent_id = $this->input->post('customer_rent_id');
        $this->customer_rent_model->deleteCustomerRent($customer_rent_id);
    }
}
