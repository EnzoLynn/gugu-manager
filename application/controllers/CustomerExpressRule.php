<?php
/**
 * Created by PhpStorm.
 * User: 周
 * Date: 2015/8/26
 * Time: 11:11
 */
defined('BASEPATH') OR exit('No direct script access allowed');

class CustomerNumber extends AdminController
{
    public function __construct()
    {
        parent::__construct();
        $this->load->model('customer_express_rule_model');
        $this->load->model('customer_express_rule_item_model');
    }

    public function index()
    {

    }

    public function countProvinceRule()
    {
        $customer_rent_id = $this->input->get_post('customer_rent_id');

        $where = array(
            'page' => (int)$this->input->post('page'),
            'limit'=> (int)$this->input->post('limit'),
            'sort' => $this->input->post('sort'),
            'dir'  => $this->input->post('dir'),
            'customer_rent_id' => $customer_rent_id
        );
        $data = array();
        $rules = $this->customer_express_rule_model->getCustomerExpressRules($where);
        foreach($rules as $rule) {
            $temp = array(
                'province_code' => $rule['province_code'],
                'count' => 1,
            );
            if($rule['price_type'] ==  1) {//汇总区间
                $temp['count'] = $this->customer_express_rule_item_model->getItemsTotal($rule['rule_id']);
            }
            $data[] = $temp;
        }

        $rules_total = $this->customer_express_rule_model->getCustomerExpressRules($customer_rent_id);

        $json = array(
            'success' => true,
            'data' => $data,
            'total' => $rules_total,
            'msg' => '成功',
            'code' => '01'
        );
        echo json_encode($json);
    }

    public function show() {
        $customer_rent_id = $this->input->get_post('customer_rent_id');
        $province_code = $this->input->get_post('province_code');
        $data = array();
        $rule = $this->customer_express_rule_model->getOneByRent($customer_rent_id, $province_code);
        if($rule['price_type'] == 0) {
            $data = $rule;
            $total = 1;
        }else{
            $items = $this->customer_express_rule_item_model->getItems($rule['rule_id']);
            $total = count($items);
            foreach($items as $item) {
                $temp = $item;
                $temp['price_type'] = 1;
                $data[] = $temp;
            }
        }
        $json = array(
            'success' => true,
            'data' => $data,
            'total' => $total,
            'msg' => '成功',
            'code' => '01'
        );
        echo json_encode($json);
    }
}