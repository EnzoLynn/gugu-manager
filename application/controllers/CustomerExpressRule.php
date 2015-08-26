<?php
/**
 * Created by PhpStorm.
 * User: 周
 * Date: 2015/8/26
 * Time: 11:11
 */
defined('BASEPATH') OR exit('No direct script access allowed');

class CustomerExpressRule extends AdminController {
    public function __construct() {
        parent::__construct();
        $this->load->model('customer_rent_model');
        $this->load->model('customer_express_rule_model');
        $this->load->model('customer_express_rule_item_model');
    }

    public function index() {

    }

    public function countProvinceRule() {
        $customer_rent_id = $this->input->get_post('customer_rent_id');

        $data = array();
        $rules = $this->customer_express_rule_model->getCustomerExpressRules($customer_rent_id);
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

    public function addRule() {
        $customer_id = 0;
        $customer_rent_id = $this->input->get_post('customer_rent_id');
        $province_code = $this->input->get_post('province_code');
        $price_type = $this->input->get_post('price_type');

        $price_start = $this->input->get_post('price_start');
        $price_pre = $this->input->get_post('price_pre');

        $rule = $this->customer_express_rule_model->getOneByRent($customer_rent_id, $province_code);
        $customer_id = $rule['customer_id'];
        if(!$rule) {
            $rent = $this->customer_rent_model->getCustomerRent($customer_rent_id);
            $customer_id = $rent['customer_id'];

            $rule_add = array(
                'customer_id' => $customer_id,
                'customer_rent_id' => $customer_rent_id,
                'province_code' => $province_code,
                'price_type' => $price_type,
                'price_start' => 0,
                'price_pre' => 0
            );
            $rule['rule_id'] = $this->customer_express_rule_model->add($rule_add);
        }
        if($price_type == 0) {
            $rule_update = array(
                'price_type' => 0,
                'price_start' => $price_start,
                'price_pre' => $price_pre
            );
            $this->customer_express_rule_model->update($rule['rule_id'], $rule_update);
        }else{
            $rule_update = array(
                'price_type' => 1,
                'price_start' => 0,
                'price_pre' => 0
            );
            $this->customer_express_rule_model->update($rule['rule_id'], $rule_update);

            $item = array(
                'rule_id'            => $rule['rule_id'],
                'customer_id'       => $customer_id,
                'customer_rent_id' => $customer_rent_id,
                'weight_price_type'=> $this->input->get_post('weight_price_type'),
                'weight_min'        => $this->input->get_post('weight_min'),
                'weight_max'        => $this->input->get_post('weight_max'),
                'weight_start_price'=> $this->input->get_post('weight_start_price'),
                'weight_pre'            => $this->input->get_post('weight_pre'),
                'weight_pre_price'     => $this->input->get_post('weight_pre_price'),
                'sort_order'            => $this->input->get_post('sort_order')
            );
            $this->customer_express_rule_item_model->add($item);
        }
        $this->show();
    }

    public function deleteRule() {
        $price_type = $this->input->get_post('price_type');
        if($price_type == 0) {
            $rule_id = $this->input->get_post('rule_id');
            $this->customer_express_rule_item_model->deleteByRuleID($rule_id);

            $rule_update = array(
                'price_type' => 0,
                'price_start' => 0,
                'price_pre' => 0
            );
            $this->customer_express_rule_model->update($rule_id, $rule_update);
        }else{
            $item_id = $this->input->get_post('item_id');
            $item_id = $this->input->get_post('item_id');
            $this->customer_express_rule_item_model->delete($item_id);
        }

        $this->show();
    }
}