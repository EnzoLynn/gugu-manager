<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Customer extends AdminController {

    public function index()
    {

    }

    public function getList(){
        $this->load->model('customer');

    }

    public function add() {
        $this->load->model('customer');

        $this->customer_model->addCustomer($this->input()->post());
    }
}
