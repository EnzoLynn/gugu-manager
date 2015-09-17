<?php
/**
 * Created by PhpStorm.
 * User: 周
 * Date: 2015/8/25
 * Time: 14:44
 */
class Customer_number_model extends CI_Model {
    var $CI;
    public function __construct(){
        parent::__construct();
        $this->CI = &get_instance();
        $this->CI->load->model('express_company_model');
        $this->CI->load->model('customer_model');
    }

    function getCustomerNumber($number_id) {
        $this->db->where('number_id', $number_id);
        $query = $this->db->get('customer_number');
        $customer_number = $query->first_row();
        return $customer_number;
    }

    function getCustomerNumbers($data) {
        if (isset($data['filter']['use_status'])) {
            $this->db->where('use_status', $data['filter']['use_status']);
        }
        if (isset($data['filter']['use_time_begin']) && $data['filter']['use_time_begin'] != '') {
            $this->db->where("use_time >= '". $data['filter']['use_time_begin'] ." 00:00:00'");
        }
        if (isset($data['filter']['use_time_end']) && $data['filter']['use_time_end'] != '') {
            $this->db->where("use_time <= '". $data['filter']['use_time_end'] ." 23:59:59'");
        }
        $this->db->where('customer_id', $data['customer_id']);
        $this->db->limit($data['limit'],  (int)($data['page'] - 1) * $data['limit']);
        $this->db->order_by($data['sort'], $data['dir']);
        $query = $this->db->get('customer_number');
        $customer_numbers = $query->result_array();
        return $customer_numbers;
    }

    function getCustomerNumbersTotal($data) {
        if (isset($data['filter']['use_status'])) {
            $this->db->where('use_status', $data['filter']['use_status']);
        }
        if (isset($data['filter']['use_time_begin']) && $data['filter']['use_time_begin'] != '') {
            $this->db->where("use_time >= '". $data['filter']['use_time_begin'] ." 00:00:00'");
        }
        if (isset($data['filter']['use_time_end']) && $data['filter']['use_time_end'] != '') {
            $this->db->where("use_time <= '". $data['filter']['use_time_end'] ." 23:59:59'");
        }
        $this->db->where('customer_id', $data['customer_id']);
        return $this->db->count_all_results('customer_number');
    }

    function addCustomerNumber($data) {
        $customer_number = array(
            'customer_id' => $data['customer_id'],
            'tracking_number' => $data['tracking_number'],
            'updated_at' => date('y-m-d H:i:s')
        );
        $this->db->insert('customer_number', $customer_number);
        $number_id =  $this->db->insert_id();
        return $number_id;
    }

    function updateCustomerNumber($number_id, $data) {
        $customer_number = array(
            //'customer_id' => $data['customer_id'],
            //'customer_number' => $data['customer_number'],
            'use_status' => $data['use_status'],
            'use_time' => date('y-m-d H:i:s')
        );
        $this->db->where('number_id', $number_id);
        return $this->db->update('customer_number', $customer_number);
    }

    function updateByTrackingNumber($tracking_number) {
        $customer_number = array(
            //'customer_id' => $data['customer_id'],
            //'customer_number' => $data['customer_number'],
            'use_status' => 1,
            'use_time' => date('y-m-d H:i:s')
        );
        $this->db->where('tracking_number', $tracking_number);
        return $this->db->update('customer_number', $customer_number);
    }

    function deleteCustomerNumber($number_id) {
        $this->db->where('number_id', $number_id);
        return $this->db->delete('customer_number');
    }

    function getOneByTrackingNumber($tracking_number) {
        $this->db->where('tracking_number', $tracking_number);
        $query = $this->db->get('customer_number');
        $customer_number = $query->first_row();
        if ($customer_number){
            return $customer_number;
        }else {
            return FALSE;
        }
    }
    //通过tracking_number查询到客户ID
    function getCustomerByTrackingNumber($tracking_number){
        $customer_number = $this->getOneByTrackingNumber($tracking_number);
        if ($customer_number) {
            $customer_id = (int)$customer_number['customer_id'];
            return $this->CI->customer_model->getCustomer($customer_id);
        } else {
            return FALSE;
        }
    }

    function importData($data) {
        $i = 0;
        foreach ($data as $row) {
            //查找快递公司
            $express =  $this->CI->express_company_model->getExpressByName($row['快递公司']);
            $customer = $this->CI->customer_model->getCustomerByField($express['customer_field'], $row['商家代码']);

            $number = $this->getCustomerByTrackingNumber($row['运单号码']);
            if ($number) {
                //已存在就不导入
                continue;
            } else {
                $i++;
                $new_number = array(
                    'customer_id' => $customer['customer_id'],
                    'tracking_number' => $row['运单号码']
                );
                $this->addCustomerNumber($new_number);
            }
        }
        return $i;
    }

    function validateData($data) {
        /*
        [运单号码] => 560082711439
        [商家代码] => 圆通快递的商家代号
        [快递公司] => 圆通快递
         * */
        $msg = array();//错误信息，一行一个
        $i = 2;//对应excel中的行
        foreach($data as $row) {
            $number = $this->getCustomerByTrackingNumber($row['运单号码']);
            if ($number) {
                //已存在就不导入
                continue;
            }
            //查找快递公司
            $express =  $this->CI->express_company_model->getExpressByName($row['快递公司']);

            if ($express) {
                //存在快递公司，再通过运单号查找客户ID
                $customer = $this->CI->customer_model->getCustomerByField($express['customer_field'], $row['商家代码']);
                if (!$customer) {
                    $msg[] = array(
                        'msg' => '第'.$i.'行，圆通商家代码（'.$row['商家代码'].'）找不到对应的客户'
                    );
                }
            } else {
                $msg[] = array(
                    'msg' => '第'.$i.'行，快递公司（'.$row['快递公司'].'）还未录入或者名字有误'
                );
            }
            $i++;
        }
        return $msg;
    }
}