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
        $this->CI->load->model('area_model');

        $this->CI->load->model('customer_model');
        $this->CI->load->model('customer_number_model');
        $this->CI->load->model('customer_rent_model');
        $this->CI->load->model('customer_express_rule_model');

        $this->CI->load->model('express_company_model');
        $this->CI->load->model('express_point_model');
        $this->CI->load->model('express_rule_model');
    }

    function getTrackingNumberByID($tracking_number_id) {
        $this->db->where('tracking_number_id', $tracking_number_id);
        $query = $this->db->get('tracking_number');
        return $query->first_row();
    }

    function getTrackingNumber($tracking_number) {
        $this->db->where('tracking_number', $tracking_number);
        $query = $this->db->get('tracking_number');
        return $query->first_row();
    }

    function getTrackingNumberByIDS($tracking_number_ids, $cond = array()) {
        if (is_string($tracking_number_ids)) {
            $tracking_number_ids = explode(',', $tracking_number_ids);
        }
        if ($cond) {
            foreach ($cond as $where) {
                $this->db->where($where);
            }
        }
        if (is_array($tracking_number_ids) && count($tracking_number_ids) > 0) {
            $this->db->where_in('tracking_number_id', $tracking_number_ids);
            $query = $this->db->get('tracking_number');
            return $query->result_array();
        }
        return FALSE;
    }

    function getWhere($data) {
//        $data = array(
//            'page' => $data['page'],
//            'limit' => $data['limit'],
//            'sort' => $data['sort'],
//            'dir' => $data['dir'],
//            'filter' => $data['filter']
//        );

        if (isset($data['filter']['customer_name'])) {
            $customer = $this->CI->customer_model->getCustomerByField('customer_name', $data['filter']['customer_name']);
            $this->db->where('customer_id', $customer['customer_id']);
        }

        if (isset($data['filter']['account_status'])) {
            $this->db->where('account_status', $data['filter']['account_status']);
        }
        if (isset($data['filter']['tracking_number'])) {
            $this->db->where('tracking_number', $data['filter']['tracking_number']);
        }
        if (isset($data['filter']['arrive_express_point_name'])) {
            $this->db->where('arrive_express_point_name', $data['filter']['arrive_express_point_name']);
        }
        if (isset($data['filter']['arrive_express_point_code'])) {
            $this->db->where('arrive_express_point_code', $data['filter']['arrive_express_point_code']);
        }
        if (isset($data['filter']['income'])) {
            $this->db->where($data['filter']['income']);
        }
        if (isset($data['filter']['cost'])) {
            $this->db->where($data['filter']['cost']);
        }
        $arrive_time_start = $data['arrive_time_start'];
        $arrive_time_end = $data['arrive_time_end'];
        if ($arrive_time_start) {
            $this->db->where("arrive_time >= '$arrive_time_start 00:00:00'");
        }
        if ($arrive_time_end) {
            $this->db->where("arrive_time <= '$arrive_time_end 23:59:59'");
        }
    }

    function getTrackingNumbers($data) {
        $this->getWhere($data);
        if (isset($data['limit'])) {
            $this->db->limit($data['limit'], (int)($data['page'] - 1) * $data['limit']);
            $this->db->order_by($data['sort'], $data['dir']);
        }
        $query = $this->db->get('tracking_number');
        return $query->result_array();
    }

    function getTrackingNumbersTotal($data){
        $this->getWhere($data);
        return $this->db->count_all_results('tracking_number');
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
            'updated_at'  => date('Y-m-d H:i:s')
        );
        $this->db->insert('tracking_number', $tracking_number);
        $tracking_number_id =  $this->db->insert_id();
        return $tracking_number_id;
    }

    function update($tracking_number_id, $data) {
        $this->db->where('tracking_number_id', $tracking_number_id);
        return $this->db->update('tracking_number', $data);
    }

    function delete($tracking_number_id) {
        $this->db->where('tracking_number_id', $tracking_number_id);
        $this->db->where('account_status', 0);//未结算才能删除
        $this->db->delete('tracking_number');
        return $this->db->affected_rows();
    }

    function importData($data) {
        $msg = $this->validateData($data);
        if ($msg) {
            return false;
        }
        $i = 0;
        foreach ($data as $row) {
            $customer = $this->CI->customer_number_model->getCustomerByTrackingNumber($row['运单号']);
            //$express = $this->CI->express_point_model->getExpressByNameAndCode($row['计费目的网点名称'], $row['计费目的网点代码']);
            $express = $this->CI->express_company_model->getExpressByName($row['快递公司']);
            //$customer_rent = $this->CI->customer_rent_model->getCustomerRentByCustomerIDAndDate($customer['customer_id'], $row['揽收时间']);//直接调用用户信息的customer_rent_id

            $customer_rent = $this->CI->customer_rent_model->getCustomerRent($customer['customer_rent_id']);

            $number = $this->getTrackingNumber($row['运单号']);
            if ($number) {
                //已存在就不导入
                continue;
            } else {
                $i++;
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
                    'customer_rent_id' => $customer_rent['customer_rent_id'],//计算的时候再判断合同号$customer['customer_rent_id'],//$customer_rent['customer_rent_id'],
                    'express_id' => $express['express_id']
                );
                $this->add($tracking_number);

                $this->CI->customer_number_model->updateByTrackingNumber($row['运单号']);
            }
        }
        return $i;
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

        //查询所有客户
        $all_customers = $this->customer_model->getAllCustomers();
        $all_customer_rents = $this->customer_rent_model->getAllEnableRents();

        //查询所有快递
        $all_express = $this->express_company_model->getAllExpress();
        $all_express = array_flip($all_express);

        $msg = array();//错误信息，一行一个
        $i = 2;//对应excel中的行
        foreach($data as $row) {
            $number = $this->getTrackingNumber($row['运单号']);
            if ($number) {
                //continue;
                $msg[] = array(
                    'msg' => '第'.$i.'行，运单号（'.$row['运单号'].'）已经存在'
                );
            } else {//运单号已经存在就不检查其他错误
                //通过运单号查找客户ID
                $number = $this->CI->customer_number_model->getOneByTrackingNumber($row['运单号']);
                if (!$number) {
                    $msg[] = array(
                        'msg' => '第'.$i.'行，运单号（'.$row['运单号'].'）找不到对应的客户'
                    );
                }
                //查找快递公司
                //$express =  $this->CI->express_company_model->getExpressByName($row['快递公司']);
                if (!isset($all_express[$row['快递公司']])) {
                    $msg[] = array(
                        'msg' => '第'.$i.'行，快递公司（'.$row['快递公司'].'）还未录入或者名字有误'
                    );
                }
                //验证重量
                if ((float)$row['重量'] == 0) {
                    $msg[] = array(
                        'msg' => '第'.$i.'行，重量（'.$row['重量'].'）格式不对'
                    );
                }
                //查找快递网点
                if (isset($all_express[$row['快递公司']])) {
                    $express_point = $this->CI->express_point_model->getPointByExpressIDAndCode($all_express[$row['快递公司']], $row['计费目的网点代码']);
                    if ( !$express_point ) {
                        $msg[] = array(
                            'msg' => '第'.$i.'行，该系统中'.$row['快递公司'].'没有找到该网点代码（'. $row['计费目的网点代码'] .'）'
                        );
                    }
                    $point = $this->CI->express_point_model->getPointByExpressIDAndName($row['express_id'], $row['arrive_express_point_name']);
                    $msg[] = array(
                        'msg' =>  '第'.$i.'行，该系统中'.$row['快递公司'].'没有找到该揽收网点名称（'. $row['计费目的网点名称'] .'）'
                    );
                }
                //验证客户的合同时间
                if ($number) {
                    $rent = $all_customer_rents[$number['customer_id']];
                    if (!$rent) {
                        $msg[] = array(
                            'msg' => '第'.$i.'行，该客户当前没有对应的租贷合同'
                        );
                    } else {
                        $date_start = strtotime($rent['date_start'].' 00:00:00');
                        $date_end = strtotime($rent['date_end'].' 23:59:59');

                        $date = strtotime($row['揽收时间']);
                        if ($date<$date_start || $date>$date_end) {

                            echo $date_start.'<br/>'.$date.'<br/>'.$date_end;exit;

                            $msg[] = array(
                                'msg' => '第'.$i.'行，根据揽收时间（'.$row['揽收时间'].'）没找到该客户对应的租贷合同'
                            );
                        }
                    }
//                    $date = strtotime($row['揽收时间']);
//                    $date = date('Y-m-d', $date);
//                    $customer_rent = $this->CI->customer_rent_model->getCustomerRentByCustomerIDAndDate($number['customer_id'], $date);
//                    if (!$customer_rent) {
//                        $msg[] = array(
//                            'msg' => '第'.$i.'行，根据揽收时间（'.$row['揽收时间'].'）没找到该客户对应的租贷合同'//.$this->CI->db->last_query()
//                        );
//                    }
                }
            }
            $i++;
        }
        return $msg;
    }

//    function validateIncome($tracking_numbers) {
//        foreach($tracking_numbers as $row) {
//            //导入的时候，不验证合同，现在开始赋值合同 ？
//            $rule_item = $this->CI->customer_express_rule_model->getItemByWeight($row['customer_rent_id'], $row['arrive_express_point_code'], $row['weight']);
//            if (!$rule_item) {
//                $customer = $this->CI->customer_model->getCustomer($row['customer_id']);
//                $customer_rent = $this->CI->customer_rent_model->getCustomerRent($customer['customer_rent_id']);
//                if (strtotime($row['arrive_time']) < strtotime($customer_rent['date_start'].' 00:00:00') || strtotime($row['arrive_time']) > strtotime($customer_rent['date_end'].' 23:59:59')) {
//                    $msg[] = array(
//                        'tracking_number' => $row['tracking_number'],
//                        'msg' =>  '揽收时间没有当前客户的合同期限内（客户名：'.$customer['customer_name'].')'
//                    );
//                }
//                $point = $this->CI->express_point_model->getPointByExpressIDAndCode($row['express_id'], $row['arrive_express_point_code']);
//                $area = $this->CI->area_model->getOne($point['province_code']);
//                $msg[] = array(
//                    'tracking_number' => $row['tracking_number'],
//                    'msg' =>  '没有匹配的收入规则（客户名：'.$customer['customer_name'].'；揽收网点地址：'. $area['area_name'] .' '.$row['arrive_express_point_name'].'；重量：'.$row['weight'].'kg)'
//                );
//            }
//        }
//        return $msg;
//    }

    /**
     * 快递单号数据计算成本
     * @author 周辉
     * @param mixed $row 快递单号数据
     * @return array 错误消息数组
     */
    function costExpression($row) {
        $msg = array();
        $rule_item = $this->CI->express_rule_model->getItemByWeight($row['express_id'], $row['arrive_express_point_code'], $row['weight']);
        if ($rule_item) {
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
        } else {
            //20150922 需求变更，成本计算根据网点代码
            $point = $this->CI->express_point_model->getPointByExpressIDAndCode($row['express_id'], $row['arrive_express_point_code']);
            $area = $this->CI->area_model->getOne($point['province_code']);
            $msg[] = array(
                'tracking_number' => $row['tracking_number'],
                'msg' =>  '没有匹配的运算成本规则（揽收网点地址：'.$area['area_name'] .' '.$row['arrive_express_point_name'].'；重量：'.$row['weight'].'kg)'
            );
        }
        return $msg;
    }

    /**
     * 快递单号数据计算收入
     * @author 周辉
     * @param mixed $row 快递单号数据
     * @return array 错误消息数组
     */
    function incomeExpression($row) {
        $msg = array();
        $rule_item = $this->CI->customer_express_rule_model->getItemByWeight($row['customer_rent_id'], $row['express_id'], $row['arrive_express_point_name'], $row['weight']);
        if ($rule_item) {
            if ($rule_item['weight_price_type'] == 0) {//进重（取整）
                if ($rule_item['weight_pre'] == 0) {
                    $pass_weight = ceil($row['weight']  - $rule_item['weight_start']);
                } else {
                    $pass_weight = ceil(($row['weight'] - $rule_item['weight_start']) / $rule_item['weight_pre']);
                }
                $income = $rule_item['weight_start_price'] + $pass_weight * $rule_item['weight_pre_price'];
            } else {//实重
                if ($rule_item['weight_pre'] == 0) {
                    $pass_price = 0;
                } else {
                    $pass_price = ($row['weight'] - $rule_item['weight_start']) * ($rule_item['weight_pre_price'] / $rule_item['weight_pre']);
                }
                $income = $rule_item['weight_start_price'] + $pass_price;
            }
            $income_data = array(
                'income' => number_format($income, 2),
                'income_time' => date('Y-m-d H:i:s')
            );
            $this->update($row['tracking_number_id'], $income_data);
        } else {
            $customer = $this->CI->customer_model->getCustomer($row['customer_id']);
            $customer_rent = $this->CI->customer_rent_model->getCustomerRent($customer['customer_rent_id']);
            if (strtotime($row['arrive_time']) < strtotime($customer_rent['date_start'].' 00:00:00') || strtotime($row['arrive_time']) > strtotime($customer_rent['date_end'].' 23:59:59')) {
                $msg[] = array(
                    'tracking_number' => $row['tracking_number'],
                    'msg' =>  '揽收时间没有当前客户的合同期限内（客户名：'.$customer['customer_name'].')'
                );
            }
            //$point = $this->CI->express_point_model->getPointByExpressIDAndCode($row['express_id'], $row['arrive_express_point_code']);
            //20150922 需求变更，收入计算根据网点名字
            $point = $this->CI->express_point_model->getPointByExpressIDAndName($row['express_id'], $row['arrive_express_point_name']);
            //$area = $this->CI->area_model->getOne($point['province_code']);
            $msg[] = array(
                'tracking_number' => $row['tracking_number'],
                'msg' =>  '没有匹配的收入规则（客户名：'.$customer['customer_name'].'；揽收网点地址：'. $row['arrive_express_point_name'].'；重量：'.$row['weight'].'kg)'
                //'msg' =>  '没有匹配的收入规则（客户名：'.$customer['customer_name'].'；揽收网点地址：'. $area['area_name'] .' '.$row['arrive_express_point_name'].'；重量：'.$row['weight'].'kg)'
            );
        }
        return $msg;
    }
    //根据状态结算
    function initAccount($data) {
        $this->getWhere($data);
        $this->db->where('income>0');
        $upd_data = array(
            'account_status' => 1
        );
        $this->db->update('tracking_number', $upd_data);
        return $this->db->affected_rows();
    }
}