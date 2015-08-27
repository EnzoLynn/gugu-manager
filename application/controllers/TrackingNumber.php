<?php
/**
 * Created by PhpStorm.
 * User: 周
 * Date: 2015/8/27
 * Time: 10:38
 */
defined('BASEPATH') OR exit('No direct script access allowed');

class TrackingNumber extends AdminController {
    public function __construct() {
        parent::__construct();
        $this->load->model('tracking_number_model');

        $this->load->model('customer_model');

        $this->load->model('customer_rent_model');
        $this->load->model('customer_express_rule_model');
        $this->load->model('customer_express_rule_item_model');

        $this->load->model('express_rule_model');
        $this->load->model('express_rule_item_model');
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

        $tracking_numbers = $this->tracking_number_model->getTrackingNumbers($data);

        $tracking_numbers_total = $this->tracking_number_model->getTrackingNumbersTotal($data);

        $json = array(
            'success' => true,
            'data' => $tracking_numbers,
            'total' => $tracking_numbers_total,
            'msg' => '成功',
            'code' => '01'
        );
        echo json_encode($json);
    }

}