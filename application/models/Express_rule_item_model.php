<?php
/**
 * Created by PhpStorm.
 * User: 周
 * Date: 2015/8/26
 * Time: 10:50
 */
class Express_rule_item_model extends CI_Model {
    function __construct() {
        parent::__construct();
    }

    function getOne($item_id) {
        $this->db->where('item_id', $item_id);
        $query = $this->db->get('express_rule_item');
        $rule = $query->first_row();
        return $rule;
    }

    function getItems($rule_id) {
        $this->db->where('rule_id', $rule_id);
        $this->db->order_by('sort_order', 'ASC');
        $query = $this->db->get('express_rule_item');
        $items = $query->result_array();

        return $items;
    }

    function getItemsTotal($rule_id) {
        $this->db->where('rule_id', $rule_id);
        return $this->db->count_all_results('express_rule_item');
    }

    function add($data) {
        $item = array(
            'rule_id'           => $data['rule_id'],
            'express_id'        => $data['express_id'],
            'price_type'        => $data['price_type'],
            'price'              => $data['price'],
            'weight_min'        => $data['weight_min'],
            'weight_max'        => $data['weight_max'],
            'sort_order'            => $data['sort_order']
        );
        $this->db->insert('express_rule_item', $item);
        $rule_id = $this->db->insert_id();
        return $rule_id;
    }

    function update($item_id, $data) {
        $item = array(
            'rule_id'           => $data['rule_id'],
            'express_id'        => $data['express_id'],
            'price_type'        => $data['price_type'],
            'price'              => $data['price'],
            'weight_min'        => $data['weight_min'],
            'weight_max'        => $data['weight_max'],
            'sort_order'            => $data['sort_order']
        );
        $this->db->where('item_id', $item_id);
        return $this->db->update('express_rule_item', $item);
    }

    function delete($item_id) {
        $this->db->where('item_id', $item_id);
        return $this->db->delete('express_rule_item');
    }
}