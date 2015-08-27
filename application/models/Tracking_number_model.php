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
        $this->CI->load->model('customer_rent_model');
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
            'arrive_express_point'    => $data['arrive_express_point'],
            'arrive_express_point_code'    => $data['arrive_express_point_code'],
            'arrive_time'    => $data['arrive_time'],
            'income'    => $data['income'],
            'cost'    => $data['cost'],
            'customer_id'    => $data['customer_id'],
            'admin_id'    => $data['admin_id'],
            'customer_rent_id'    => $data['customer_rent_id']
        );
        $this->db->insert('tracking_number', $tracking_number);
        $tracking_number_id =  $this->db->insert_id();
        return $tracking_number_id;
    }

    function update($tracking_number_id, $data) {
        $this->db->where('tracking_number_id', $tracking_number_id);
        return $this->db->update('tracking_number', $data);
    }
}