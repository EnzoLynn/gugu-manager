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
                'count' => 0,
            );

            $temp['count'] = $this->customer_express_rule_item_model->getItemsTotal($rule['rule_id']);

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

        $items = $this->customer_express_rule_item_model->getItems($rule['rule_id']);
        $total = $this->customer_express_rule_item_model->getItemsTotal($rule['rule_id']);
        foreach($items as $item) {
            $temp = $item;
            if($item['weight_price_type'] == 0 ) {
                $temp['weight_price_type_name'] = '进位';
            }else{
                $temp['weight_price_type_name'] = '实重';
            }
            $data[] = $temp;
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

        $rule = $this->customer_express_rule_model->getOneByRent($customer_rent_id, $province_code);
        $customer_id = $rule['customer_id'];
        if(!$rule) {
            $rent = $this->customer_rent_model->getCustomerRent($customer_rent_id);
            $customer_id = $rent['customer_id'];

            $rule_add = array(
                'customer_id' => $customer_id,
                'customer_rent_id' => $customer_rent_id,
                'province_code' => $province_code
            );
            $rule['rule_id'] = $this->customer_express_rule_model->add($rule_add);
        }

        $weight_min = $this->input->get_post('weight_min');
        $weight_max = $this->input->get_post('weight_max');
        //先检查是否存在该区间
        $item1 = $this->customer_express_rule_model->getItemByRuleAndWeight($rule['rule_id'], $weight_min);
        $item2 = $this->customer_express_rule_model->getItemByRuleAndWeight($rule['rule_id'], $weight_max);
        $item3 = $this->customer_express_rule_model->getItemByRuleAndWeightBetween($rule['rule_id'], $weight_min, $weight_max);
        if ($item1) {
            output_error('其他区间已经包含起始重量');
        }
        if ($item2) {
            output_error('其他区间已经包含结束重量');
        }
        if ($item3) {
            output_error('重量区间重复');
        }

        $item = array(
            'rule_id'            => $rule['rule_id'],
            'customer_id'       => $customer_id,
            'customer_rent_id' => $customer_rent_id,
            'weight_price_type'=> $this->input->get_post('weight_price_type'),
            'weight_min'        => $weight_min,
            'weight_max'        => $weight_max,
            'weight_start'      => $this->input->get_post('weight_start'),
            'weight_start_price'=> $this->input->get_post('weight_start_price'),
            'weight_pre'            => $this->input->get_post('weight_pre'),
            'weight_pre_price'     => $this->input->get_post('weight_pre_price'),
            'sort_order'            => $this->input->get_post('sort_order')
        );
        $this->customer_express_rule_item_model->add($item);

        $this->show();
    }

    public function deleteRule() {
        $item_id = $this->input->get_post('item_id');
        $this->customer_express_rule_item_model->delete($item_id);

        $this->show();
    }

    public function copyProvinceRule() {
        $customer_rent_id = $this->input->get_post('customer_rent_id');
        $province_code_from = $this->input->get_post('province_code_from');
        $province_code_to = $this->input->get_post('province_code_to');

        //清空旧数据
        $rule_to = $this->customer_express_rule_model->getOneByRent($customer_rent_id, $province_code_to);
        $this->customer_express_rule_item_model->deleteByRuleID($rule_to['rule_id']);
        $this->customer_express_rule_model->delete($rule_to['rule_id']);


        $rule_from = $this->customer_express_rule_model->getOneByRent($customer_rent_id, $province_code_from);
        $rule_to = $rule_from;
        unset($rule_to['rule_id']);
        $rule_to['province_code'] = $province_code_to;
        $new_rule_id = $this->customer_express_rule_model->add($rule_to);


        $rule_item_from = $this->customer_express_rule_item_model->getItems($rule_from['rule_id']);
        foreach ($rule_item_from as $rule_item) {
            unset($rule_item['item_id']);
            $rule_item['rule_id'] = $new_rule_id;
            $this->customer_express_rule_item_model->add($rule_item);
        }

        output_success();
    }
}