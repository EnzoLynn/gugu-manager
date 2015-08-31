<?php
/**
 * Created by PhpStorm.
 * User: 周
 * Date: 2015/8/27
 * Time: 15:17
 */
class Tracking_number_model extends CI_Model {
    var $CI;
    public function __construct() {
        parent::__construct();
        $this->CI = &get_instance();
        $this->CI->load->model('customer_model');
        $this->CI->load->model('customer_number_model');
        $this->CI->load->model('customer_rent_model');
        $this->CI->load->model('customer_express_rule_model');

        $this->CI->load->model('express_company_model');
        $this->CI->load->model('express_point_model');
        $this->CI->load->model('express_rule_model');
    }

    function getTrackingNumber($tracking_number) {
        $this->db->where('tracking_number', $tracking_number);
        $query = $this->db->get('tracking_number');;
        return $query->first_row();
    }

    function getTrackingNumbers($data) {
        $arrive_time_start = $data['arrive_time_start'];
        $arrive_time_end = $data['arrive_time_end'];
        $data = array(
            'page' => (int)$data['page'],
            'limit' => (int)$data['limit'],
            'sort' => $data['sort'],
            'dir' => $data['dir'],
            'filter' => $data['filter']
        );
        if ($data['limit']) {
            $this->db->limit($data['limit'], (int)($data['page'] - 1) * $data['limit']);
        }
        if (isset($data['filter']['account_status'])) {
            $this->db->where('account_status', $data['filter']['account_status']);
            unset($data['filter']['account_status']);
        }
        $this->db->like($data['filter']);
        if ($arrive_time_start) {
            $this->db->where("arrive_time >= '$arrive_time_start 00:00:00'");
        }
        if ($arrive_time_end) {
            $this->db->where("arrive_time <= '$arrive_time_end 23:59:59'");
        }
        $this->db->order_by($data['sort'], $data['dir']);
        $query = $this->db->get('tracking_number');
        return $query->result_array();
    }

    function getTrackingNumbersTotal($data){
        $arrive_time_start = $data['arrive_time_start'];
        $arrive_time_end = $data['arrive_time_end'];
        if ($arrive_time_start) {
            $this->db->where("arrive_time >= '$arrive_time_start 00:00:00'");
        }
        if ($arrive_time_end) {
            $this->db->where("arrive_time <= '$arrive_time_end 23:59:59'");
        }
        if (isset($data['filter']['account_status'])) {
            $this->db->where('account_status', $data['filter']['account_status']);
            unset($data['filter']['account_status']);
        }
        $this->db->like($data['filter']);
        return $this->db->count_all_results('tracking_number');
    }

    function getTrackingNumbersByType($type = 'income_cost') {
        if($type == 'income') {
            $this->db->where('income', 0);
        } else if ($type == 'cost') {
            $this->db->where('cost', 0);
        } else {
            $this->db->where('income', 0);
            $this->db->where('cost', 0);
        }
        $this->db->order_by('tracking_number_id', 'DESC');
        $query = $this->db->get('tracking_number');
        return $query->result_array();
    }

    function add($data) {
        $tracking_number = array(
            'tracking_number' => $data['tracking_number'],
            'weight'  => $data['weight'],
            'arrive_express_point_name'    => $data['arrive_express_point_name'],
            'arrive_express_point_code'    => $data['arrive_express_point_code'],
            'arrive_time'    => $data['arrive_time'],
            'income'    => $data['income'],
            'cost'    => $data['cost'],
            'customer_id'    => $data['customer_id'],
            'admin_id'    => $data['admin_id'],
            'customer_rent_id'    => $data['customer_rent_id'],
            'express_id' => $data['express_id'],
            'update_at'  => date('Y-m-d H:i:s')
        );
        $this->db->insert('tracking_number', $tracking_number);
        $tracking_number_id =  $this->db->insert_id();
        return $tracking_number_id;
    }

    function update($tracking_number_id, $data) {
        $this->db->where('tracking_number_id', $tracking_number_id);
        return $this->db->update('tracking_number', $data);
    }

    function importData($data) {
        $msg = $this->validateData($data);
        if ($msg) {
            return false;
        }
        foreach ($data as $row) {
            $customer = $this->CI->customer_number_model->getCustomerByTrackingNumber($row['运单号']);
            //$express = $this->CI->express_point_model->getExpressByNameAndCode($row['计费目的网点名称'], $row['计费目的网点代码']);
            $express = $this->CI->express_company_model->getExpressByName($row['快递公司']);
            $customer_rent = $this->CI->customer_rent_model->getCustomerRentByCustomerIDAndDate($customer['customer_id'], $row['揽收时间']);

            $number = $this->getTrackingNumber($row['运单号']);
            if ($number) {
                //已存在就不导入
                continue;
            } else {
                $tracking_number = array(
                    'tracking_number' => $row['运单号'],
                    'weight' => (float)$row['重量'],
                    'arrive_express_point_name' => $row['计费目的网点名称'],
                    'arrive_express_point_code' => $row['计费目的网点代码'],
                    'arrive_time' => $row['揽收时间'],
                    'income' => 0,
                    'cost' => 0,
                    'customer_id' => $customer['customer_id'],
                    'admin_id' => $this->CI->admin_id,
                    'customer_rent_id' => $customer_rent['customer_rent_id'],
                    'express_id' => $express['express_id']
                );
                $this->add($tracking_number);
            }
        }
    }

    function validateData($data) {
/*
[运单号] => 560082711439
[重量] => 0.3
[计费目的网点名称] => 青海省西宁市
[计费目的网点代码] => 971001
[揽收时间] => 2015-06-01 17:05:54.96
[快递公司] => 圆通快递
 * */
        $msg = array();//错误信息，一行一个
        $i = 2;//对应excel中的行
        foreach($data as $row) {
            //通过运单号查找客户ID
            $customer = $this->CI->customer_number_model->getCustomerByTrackingNumber($row['运单号']);
            if (!$customer) {
                $msg[] = array(
                    'msg' => '第'.$i.'行，运单号找不到对应的客户'
                );
            }
            //查找快递公司
            $express =  $this->CI->express_company_model->getExpressByName($row['快递公司']);
            if (!$express) {
                $msg[] = array(
                    'msg' => '第'.$i.'行，快递公司还未录入或者名字有误'
                );
            }
            //验证重量
            if (!preg_match('/^[0-9]+(\.[0-9]{1,3})?$/', $row['重量'])) {
                if ((float)$row['重量'] == 0) {
                    $msg[] = array(
                        'msg' => '第'.$i.'行，重量不能为0'
                    );
                }else{
                    $msg[] = array(
                        'msg' => '第'.$i.'行，重量格式不正确'
                    );
                }
            }
            //查找快递网点
            if ($express) {
                $express_point = $this->CI->express_point_model->getPointByExpressIDAndCode($express['express_id'], $row['计费目的网点代码']);
                if ( !$express_point ) {
                    $msg[] = array(
                        'msg' => '第'.$i.'行，该系统中'.$row['快递公司'].'没有找到该网点'
                    );
                }
            }
            //验证客户的合同时间
            if ($customer) {
                $customer_rent = $this->CI->customer_rent_model->getCustomerRentByCustomerIDAndDate($customer['customer_id'], $row['揽收时间']);
                if (!$customer_rent) {
                    $msg[] = array(
                        'msg' => '第'.$i.'行，根据揽件时间没找到该客户对应的租贷合同'//.$this->CI->db->last_query()
                    );
                }
            }
            $i++;
        }
        return $msg;
    }

    function validateIncome() {
        $msg = array();
        $tracking_numbers = $this->getTrackingNumbersByType('income');
        foreach($tracking_numbers as $row) {
            $rule_item = $this->customer_express_rule_model->getItemByWeight($row['customer_rent_id'], $row['arrive_express_point_code'], $row['weight']);
            if (!$rule_item) {
                $customer = $this->CI->customer_model->getCustomer($row['customer_id']);
                $msg[] = array(
                    'msg' =>  $row['tracking_number'] . '没有匹配的收入规则（客户名：'.$customer['customer_name'].'；揽收网点地址：'.$row['arrive_express_point_name'].'；重量：'.$row['weight'].'kg)'
                );
            }
        }
        return $msg;
    }

    function countIncome() {
        $tracking_numbers = $this->getTrackingNumbersByType('income');
        foreach($tracking_numbers as $row) {
            $income = 0;
            $rule_item = $this->CI->customer_express_rule_model->getItemByWeight($row['customer_rent_id'], $row['arrive_express_point_code'], $row['weight']);
            if ($rule_item['price_type'] == 0) {//固定价格 + 单价
                $income = $rule_item['price_start'] + $rule_item['price_pre'] * $row['weight'];
            } else if ($rule_item['price_type'] == 1) {//步进价格
                if ($rule_item['weight_price_type'] == 0) {//进重（取整）
                    $pass_weight = ceil(($row['weight'] - $rule_item['weight_min']) / $rule_item['weight_pre']);
                    $income = $row['weight_start_price'] + $pass_weight * $rule_item['weight_pre_price'];
                } else {//实重
                    $pass_price = ($row['weight'] - $rule_item['weight_min']) * ($rule_item['weight_pre_price'] / $rule_item['weight_pre']);
                    $income = $row['weight_start_price'] + $pass_price;
                }
            }
            $income_data = array(
                'income' => $income,
                'income_time' => date('Y-m-d H:i:s')
            );
            $this->update($row['tracking_number_id'], $income_data);
        }
    }

    function validateCost() {
        $msg = array();
        $tracking_numbers = $this->getTrackingNumbersByType('cost');

        foreach($tracking_numbers as $row) {
            $rule_item = $this->CI->express_rule_model->getItemByWeight($row['express_id'], $row['arrive_express_point_code'], $row['weight']);
            if (!$rule_item) {
                $msg[] = array(
                    'msg' =>  $row['tracking_number'] . '没有匹配的运算成本规则（揽收网点地址：'.$row['arrive_express_point_name'].'；重量：'.$row['weight'].'kg)'
                );
            }
        }
        return $msg;
    }

    function countCost() {
        $tracking_numbers = $this->getTrackingNumbersByType('cost');
        foreach($tracking_numbers as $row) {
            $cost = 0;
            $rule_item = $this->CI->express_rule_model->getItemByWeight($row['express_id'], $row['arrive_express_point_code'], $row['weight']);
            if ($rule_item['price_type'] == 1) {//固定价格
                $cost = $rule_item['price'];
            } else if ($rule_item['price_type'] == 2) {//称重价格
                $cost = $row['weight'] * $rule_item['price'];
            }
            $cost_data = array(
                'cost' => $cost,
                'cost_time' => date('Y-m-d H:i:s')
            );
            $this->update($row['tracking_number_id'], $cost_data);
        }
    }
}