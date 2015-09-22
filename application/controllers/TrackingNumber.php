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

    //生成状态结算
    public function initAccount() {
        if ($this->checkCondition() == FALSE) {
            output_error('条件不足，不能执行该操作');
        }

        if ($this->input->post('tracking_number_ids')) {
            $tracking_number_ids = explode(',', $this->input->post('tracking_number_ids'));
            $cond = array('account_status=0');//income = 0
            $tracking_numbers = $this->tracking_number_model->getTrackingNumberByIDS($tracking_number_ids, $cond);
        } else {
            $data = array(
                'arrive_time_start' => $this->input->get_post('arrive_time_start'),
                'arrive_time_end' => $this->input->get_post('arrive_time_end'),
                'filter' => objectToArray(json_decode($this->input->get_post('filter')))
            );
            $data['filter']['account_status'] = 0;//未结算的才能重新计算收入或者成本
            $data['filter']['income'] = 'income>0';//收入大于0才能结算
            //$data['filter']['cost'] = 'cost>0';//成本无所谓
            $tracking_numbers = $this->tracking_number_model->getTrackingNumbers($data);
        }
        $total = 0;
        foreach ($tracking_numbers as $tracking_number) {
            $upd_data = array(
                'account_status' => 1
            );
            $result = $this->tracking_number_model->update($tracking_number['tracking_number_id'], $upd_data);
            if ($result) {
                $total++;
            }
        }
        output_success('成功', $total);
    }

    //导出excel
    public function downloadExcel() {
//        if ($this->checkCondition() == FALSE) {
//            output_error('条件不足，不能执行该操作');
//        }

        if ($this->input->post('tracking_number_ids')) {
            $tracking_number_ids = explode(',', $this->input->post('tracking_number_ids'));
            $cond = array('account_status=0');//income = 0
            $tracking_numbers = $this->tracking_number_model->getTrackingNumberByIDS($tracking_number_ids, $cond);
        } else {
            $data = array(
                'arrive_time_start' => $this->input->get_post('arrive_time_start'),
                'arrive_time_end' => $this->input->get_post('arrive_time_end'),
                'filter' => objectToArray(json_decode($this->input->get_post('filter')))
            );
            $data['filter']['account_status'] = 0;//未结算的才能重新计算收入或者成本
            $tracking_numbers = $this->tracking_number_model->getTrackingNumbers($data);
        }

        //查询所有客户
        $all_customers = $this->customer_model->getAllCustomers();

        //查询所有快递
        $all_express = $this->express_company_model->getAllExpress();

        foreach ($tracking_numbers as $key => $val) {
            if($val['account_status'] == 0) {
                $tracking_numbers[$key]['account_status_name'] = '未结算';
            }else{
                $tracking_numbers[$key]['account_status_name'] = '已结算';
            }
            //客户名字
            //$customer = $this->customer_model->getCustomer($val['customer_id']);
            //$tracking_numbers[$key]['customer_name'] = $customer['customer_name'];
            $tracking_numbers[$key]['customer_name'] = $all_customers[$tracking_numbers[$key]['customer_id']];
            //操作人名字
            $tracking_numbers[$key]['admin_name'] = $this->admin_name;
            //快递公司名字
            //$express = $this->express_company_model->getOne($val['express_id']);
            //$tracking_numbers[$key]['express_name'] = $express['express_name'];
            $tracking_numbers[$key]['express_name'] = $all_express[$tracking_numbers[$key]['express_id']];
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

    public function countPrice() {
        //type = income 收入计算，cost 成本计算， income_cost 收入成本计算
        $type = $this->input->get_post('type');
        $msg = array();

        if ($this->checkCondition() == FALSE) {
            output_error('条件不足，不能执行该操作');
        }

        if ($this->input->post('tracking_number_ids')) {
            $tracking_number_ids = explode(',', $this->input->post('tracking_number_ids'));
            $cond = array('account_status=0');//income = 0
            $tracking_numbers = $this->tracking_number_model->getTrackingNumberByIDS($tracking_number_ids, $cond);
        } else {
            $data = array(
                'arrive_time_start' => $this->input->get_post('arrive_time_start'),
                'arrive_time_end' => $this->input->get_post('arrive_time_end'),
                'filter' => objectToArray(json_decode($this->input->get_post('filter')))
            );
            $data['filter']['account_status'] = 0;//未结算的才能重新计算收入或者成本
            $tracking_numbers = $this->tracking_number_model->getTrackingNumbers($data);
        }

        if ($type == 'income') {
            foreach ($tracking_numbers as $tracking_number) {
                $temp_msg = $this->tracking_number_model->incomeExpression($tracking_number);
                if ($temp_msg) {
                    $msg = array_merge($msg, $temp_msg);
                }
            }
        } else if ($type == 'cost') {
            foreach ($tracking_numbers as $tracking_number) {
                $temp_msg = $this->tracking_number_model->costExpression($tracking_number);
                if ($temp_msg) {
                    $msg = array_merge($msg, $temp_msg);
                }
            }
        }
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
        output_success();
    }

    public function reCountPrice() {
        $this->countPrice();
    }

    public function delete() {
        if ($this->checkCondition() == FALSE) {
            output_error('条件不足，不能执行该操作');
        }

        if ($this->input->post('tracking_number_ids')) {
            $tracking_number_ids = explode(',', $this->input->post('tracking_number_ids'));
            $tracking_numbers = $this->tracking_number_model->getTrackingNumberByIDS($tracking_number_ids);
        } else {
            $data = array(
                'arrive_time_start' => $this->input->get_post('arrive_time_start'),
                'arrive_time_end' => $this->input->get_post('arrive_time_end'),
                'filter' => objectToArray(json_decode($this->input->get_post('filter')))
            );
            $tracking_numbers = $this->tracking_number_model->getTrackingNumbers($data);
        }
        $delete_total = 0;
        foreach ($tracking_numbers as $tracking_number) {
            $result = $this->tracking_number_model->delete($tracking_number['tracking_number_id']);
            if ($result) {
                $delete_total++;
            }
        }
        output_success('成功', $delete_total);
    }

    /**
     * 根据需求，所有匹配的操作，都必须（客户名、快递单号或者时间至少有一项）
     * @author 周辉
     * @date 20150921
     * @access public
     * @return array 根据条件查询获取到的快递单号
     */
    private function checkCondition() {
        //默认不能执行批量操作
        $enable = FALSE;
        if ($this->input->post('tracking_number_ids')) {
            $enable = TRUE;
        } else {
            $data = array(
                'arrive_time_start' => $this->input->get_post('arrive_time_start'),
                'arrive_time_end' => $this->input->get_post('arrive_time_end'),
                'filter' => objectToArray(json_decode($this->input->get_post('filter')))
            );

            if (isset($data['filter']['tracking_number']) && !empty($data['filter']['tracking_number'])) {
                $enable = TRUE;
            }
            if (isset($data['filter']['customer_name']) && !empty($data['filter']['customer_name'])) {
                $enable = TRUE;
            }
            if (isset($data['arrive_time_start']) && isset($data['arrive_time_end']) && !empty($data['arrive_time_start']) && !empty($data['arrive_time_end'])) {
                $enable = TRUE;
            }
        }
        return $enable;
    }
}