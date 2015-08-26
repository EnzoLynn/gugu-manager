<?php
/**
 * Created by PhpStorm.
 * User: 周
 * Date: 2015/8/26
 * Time: 11:11
 */
defined('BASEPATH') OR exit('No direct script access allowed');

class ExpressRule extends AdminController {
    public function __construct() {
        parent::__construct();
        $this->load->model('express_rule_model');
        $this->load->model('express_rule_item_model');
    }

    public function index() {

    }

    public function countProvinceRule() {
        $express_id = $this->input->get_post('express_id');

        $data = array();
        $rules = $this->express_rule_model->getExpressRules($express_id);
        foreach($rules as $rule) {
            //汇总区间
            $temp_count = $this->express_rule_item_model->getItemsTotal($rule['rule_id']);
            if($temp_count > 0) {
                $data[] = array(
                    'province_code' => $rule['province_code'],
                    'count' => $temp_count
                );
            }
        }

        $rules_total = $this->express_rule_model->getExpressRulesTotal($express_id);

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
        $express_id = $this->input->get_post('express_id');
        $province_code = $this->input->get_post('province_code');
        $data = array();
        $rule = $this->express_rule_model->getOneByProvince($express_id, $province_code);

        $items = $this->express_rule_item_model->getItems($rule['rule_id']);
        $total = $this->express_rule_item_model->getItemsTotal($rule['rule_id']);
        foreach($items as $item) {
            $temp = $item;
            if($item['price_type'] == 1 ) {
                $temp['price_type_name'] = '固定价格';
            }else{
                $temp['price_type_name'] = '称重价格';
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
        $express_id = $this->input->get_post('express_id');
        $province_code = $this->input->get_post('province_code');

        $rule = $this->express_rule_model->getOneByProvince($express_id, $province_code);
        if(!$rule) {
            $rule_add = array(
                'express_id' => $express_id,
                'province_code' => $province_code
            );
            $rule['rule_id'] = $this->express_rule_model->add($rule_add);
        }

        $item = array(
            'rule_id'            => $rule['rule_id'],
            'express_id'        => $express_id,
            'price_type'        => $this->input->get_post('price_type'),
            'price'              => $this->input->get_post('price'),
            'weight_min'        => $this->input->get_post('weight_min'),
            'weight_max'        => $this->input->get_post('weight_max'),
            'sort_order'            => $this->input->get_post('sort_order')
        );
        $this->express_rule_item_model->add($item);

        $this->show();
    }

    public function deleteRule() {
        $item_id = $this->input->get_post('item_id');
        $this->express_rule_item_model->delete($item_id);

        $this->show();
    }
}