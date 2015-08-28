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

        $this->CI->load->model('express_point_model');
    }

    function getTrackingNumber($tracking_number) {
        $this->db->where('tracking_number', $tracking_number);
        $query = $this->db->get('tracking_number');;
        return $query->first_row();
    }

    function getTrackingNumbers($data)
    {
        $data = array(
            'page' => (int)$data['page'],
            'limit' => (int)$data['limit'],
            'sort' => $data['sort'],
            'dir' => $data['dir'],
            'filter' => $data['filter']
        );

        $this->db->limit($data['limit'], (int)($data['page'] - 1) * $data['limit']);
        if ($data['filter']) {
            $this->db->or_like($data['filter']);
        }
        $this->db->order_by($data['sort'], $data['dir']);
        $query = $this->db->get('tracking_number');
        $rows = $query->result_array();
        foreach ($rows as $key => $val) {
            if($val['account_status'] == 0) {
                $rows[$key]['account_status'] = '未结算';
            }else{
                $rows[$key]['account_status'] = '已结算';
            }
        }
        return $rows;
    }

    function getTrackingNumbersTotal($data){
        $data = array(
            'filter' => $data['filter']
        );
        $this->db->or_like($data['filter']);
        return $this->db->count_all_results('tracking_number');
    }

    function add($data) {

        //$data['customer_id'] = '';
        //$data['admin_id'] = '';
        //$data['cistp,er_rent_id'] = '';

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
            'express_id' => $data['express_id']
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
            $customer_id = $this->CI->customer_number_model->getCustomerID($row['运单号']);
            $express = $this->CI->express_point_model->getOneByNameAndCode($row['计费目的网点名称'], $row['计费目的网点代码']);
            $customer_rent = $this->CI->customer_rent_model->getCustomerRentByCustomerIDAndDate($customer_id, $row['揽收时间']);
            $tracking_number = array(
                'tracking_number' => $data['运单号'],
                'weight'  => (float)$data['重量'],
                'arrive_express_point_name'    => $data['计费目的网点名称'],
                'arrive_express_point_code'    => $data['计费目的网点代码'],
                'arrive_time'    => $data['揽收时间'],
                'income'    => 0,
                'cost'    => 0,
                'customer_id'    => $customer_id,
                'admin_id'    => $this->CI->admin_id,
                'customer_rent_id'    => $customer_rent['customer_rent_id'],
                'express_id' => $express['express_id']
            );
            $this->add($tracking_number);
        }
    }

    function validateData($data) {
/*
[运单号] => 560082711439
[重量] => 0.3
[计费目的网点名称] => 青海省西宁市
[计费目的网点代码] => 971001
[揽收时间] => 2015-06-01 17:05:54.96
 * */
        $msg = array();//错误信息，一行一个
        $i = 2;//对应excel中的行
        foreach($data as $row) {
            //通过运单号查找客户ID
            $customer_id = $this->CI->customer_number_model->getCustomerID($row['运单号']);
            if ($customer_id == 0) {
                $msg[] = array(
                    'msg' => '第'.$i.'行，运单号找不到对应的客户'
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
            $express = $this->CI->express_point_model->getOneByNameAndCode($row['计费目的网点名称'], $row['计费目的网点代码']);
            if ( !$express ) {
                $msg[] = array(
                    'msg' => '第'.$i.'行，揽件网点找不到对应快递公司'
                );
            }
            //验证客户的合同时间
            if ($customer_id >0 ) {
                $customer_rent = $this->CI->customer_rent_model->getCustomerRentByCustomerIDAndDate($customer_id, $row['揽收时间']);
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
}