<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class CustomerRent extends AdminController {

    public function index(){

    }

    public function getList(){
        $this->load->model('customer_rent_model');

        $data = array(
            'page' => (int)$this->input->post('page'),
            'limit'=> (int)$this->input->post('limit'),
            'sort' => $this->input->post('sort'),
            'dir'  => $this->input->post('dir'),
            'filter' => json_decode($this->input->post('filter')),
            'customer_id' => (int)$this->input->post('customer_id')
        );
        $customer_rents = $this->customer_rent_model->getCustomerRents($data);

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
        $this->load->model('customer_rent_model');

        $data = array(
            'customer_id' => $this->input->post('customer_id'),
            'title' => $this->input->post('title'),
            'rent_area' => $this->input->post('rent_area'),
            'area_to_order_number' => $this->input->post('area_to_order_number'),
            'rent_pre_price' => $this->input->post('rent_pre_price'),
            'date_start' => $this->input->post('date_start'),
            'date_end' => $this->input->post('date_end')
        );

        $this->customer_model->addCustomer($data);
    }
}
