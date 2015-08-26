<?php
/**
 * Created by PhpStorm.
 * User: 周
 * Date: 2015/8/26
 * Time: 10:50
 */
class Customer_express_rule_item_model extends CI_Model
{
    function __construct()
    {
        parent::__construct();
    }

    function getOne($item_id)
    {
        $this->db->where('item_id', $item_id);
        $query = $this->db->get('customer_express_rule_item');
        $rule = $query->first_row();
        return $rule;
    }

    function getItems($data)
    {
        $data = array(
            'rule_id' => $data['rule_id'],
            'page' => (int)$data['page'],
            'limit' => (int)$data['limit'],
            'sort' => $data['sort'],
            'dir' => $data['dir']
            //'filter' => $data['filter']
        );

        $this->db->limit($data['limit'], (int)($data['page'] - 1) * $data['limit']);
        $this->db->where('rule_id', $data['rule_id']);
        $this->db->order_by($data['sort'], $data['dir']);
        $query = $this->db->get('customer_express_rule_item');
        $customer_numbers = $query->result_array();

        return $customer_numbers;
    }

    function getItemsTotal($rule_id)
    {
        $this->db->where('rule_id', $rule_id);
        return $this->db->count_all('customer_express_rule_item');
    }

    function add($data)
    {
        $item = array(
            'rule_id'            => $data['rule_id'],
            'customer_id'       => $data['customer_id'],
            'customer_rent_id' => $data['customer_rent_id'],
            'weight_price_type'=> $data['weight_price_type'],
            'weight_min'        => $data['weight_min'],
            'weight_max'        => $data['weight_max'],
            'weight_start_price'=> $data['weight_start_price'],
            'weight_pre'            => $data['weight_pre'],
            'weight_pre_price'     => $data['weight_pre_price'],
            'sort_order'            => $data['sort_order']
        );
        $this->db->insert('customer_express_rule_item', $item);
        $rule_id = $this->db->insert_id();
        return $rule_id;
    }

    function update($item_id, $data)
    {
        $item = array(
            'rule_id'            => $data['rule_id'],
            'customer_id'       => $data['customer_id'],
            'customer_rent_id' => $data['customer_rent_id'],
            'weight_price_type'=> $data['weight_price_type'],
            'weight_min'        => $data['weight_min'],
            'weight_max'        => $data['weight_max'],
            'weight_start_price'=> $data['weight_start_price'],
            'weight_pre'            => $data['weight_pre'],
            'weight_pre_price'     => $data['weight_pre_price'],
            'sort_order'            => $data['sort_order']
        );
        $this->db->where('item_id', $item_id);
        return $this->db->update('customer_express_rule_item', $item);
    }

    function delete($item_id)
    {
        $this->db->where('item_id', $item_id);
        return $this->db->delete('customer_express_rule_item');
    }
}