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

        $this->load->model('express_company_model');

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

        foreach ($tracking_numbers as $key => $val) {
            if($val['account_status'] == 0) {
                $tracking_numbers[$key]['account_status_name'] = '未结算';
            }else{
                $tracking_numbers[$key]['account_status_name'] = '已结算';
            }
            //客户名字
            $customer = $this->customer_model->getCustomer($val['customer_id']);
            $tracking_numbers[$key]['customer_name'] = $customer['customer_name'];
            //操作人名字
            $tracking_numbers[$key]['admin_name'] = $this->admin_name;
            //快递公司名字
            $express = $this->express_company_model->getOne($val['express_id']);
            $tracking_numbers[$key]['express_name'] = $express['express_name'];
        }

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

    public function countPrice() {
        //type = income 收入计算，cost 成本计算， income_cost 收入成本计算
        $type = $this->input->get_post('type');
        //计算成本
        if ($type == 'cost') {
            $msg = $this->tracking_number_model->validateCost('cost');
            if ($msg) {
                $json = array(
                    'success' => false,
                    'data' => $msg,
                    'total' => count($msg),
                    'msg' => '有错误',
                    'code' => '89'
                );
                echo json_encode($json);
                exit;
            }
        } else if ($type == 'income') {
            $msg = $this->tracking_number_model->validateCost('income');
            if ($msg) {
                $json = array(
                    'success' => false,
                    'data' => $msg,
                    'total' => count($msg),
                    'msg' => '有错误',
                    'code' => '89'
                );
                echo json_encode($json);
                exit;
            }
        }
    }
}