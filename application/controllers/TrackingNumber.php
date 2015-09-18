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

    public function downloadExcel() {
        $data = array(
            'page' => '',
            'limit'=> '',
            'arrive_time_start' => $this->input->get_post('arrive_time_start'),
            'arrive_time_end' => $this->input->get_post('arrive_time_end'),
            'sort' => 'tracking_number_id',
            'dir'  => 'ASC',
            'filter' => objectToArray(json_decode($this->input->get_post('filter')))
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

        $header = array(
            'tracking_number_id'             => '自动编号',
            'tracking_number'                => '运单号',
            'weight'                           => '重量',
            'arrive_express_point_name'    => '网点名称',
            'arrive_express_point_code'    => '网点代码',
            'arrive_time'                    => '揽收时间',
            'income'                         => '收入（元）',
            'cost'                           => '成本（元）',
            'customer_name'                => '客户名称',
            'account_status_name'         => '结算状态',
            'express_name'                 => '快递公司'
        );
        outputExcel($tracking_numbers, $header);
    }

    public function getList() {
        $data = array(
            'arrive_time_start' => $this->input->post('arrive_time_start'),
            'arrive_time_end' => $this->input->post('arrive_time_end'),

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
            $msg = $this->tracking_number_model->countCost();
            if (count($msg) > 0) {
                $json = array(
                    'success' => false,
                    'data' => $msg,
                    'total' => count($msg),
                    'msg' => '数据有问题',
                    'code' => '89'
                );
                echo json_encode($json);
                exit;
            }
        } else if ($type == 'income') {
            $msg = $this->tracking_number_model->countIncome();
            if (count($msg) > 0) {
                $json = array(
                    'success' => false,
                    'data' => $msg,
                    'total' => count($msg),
                    'msg' => '数据有问题',
                    'code' => '89'
                );
                echo json_encode($json);
                exit;
            }
        }
        output_success();
    }

    public function delete() {
        $tracking_number_ids = explode(',', $this->input->post('$tracking_number_ids'));
        $delete_total = 0;
        foreach ($tracking_number_ids as $tracking_number_id) {
            $result = $this->tracking_number_model->delete($tracking_number_id);
            if ($result) {
                $delete_total++;
            }
        }
        output_success('成功', $delete_total);
    }
}