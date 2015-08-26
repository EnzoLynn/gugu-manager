<?php
/**
 * Created by PhpStorm.
 * User: 周
 * Date: 2015/8/26
 * Time: 12:06
 */
class Express_rule_model extends CI_Model {
    public function __construct() {
        parent::__construct();
    }

    function getOne($rule_id) {
        $this->db->where('rule_id', $rule_id);
        $query = $this->db->get('express_rule');;
        $express_rule = $query->first_row();
        return $express_rule;
    }

    function getOneByProvince($express_id, $province_code) {
        $this->db->where('express_id', $express_id);
        $this->db->where('province_code', $province_code);
        $query = $this->db->get('express_rule');;
        $express_rule = $query->first_row();
        return $express_rule;
    }

    function add($data) {
        $express_rule = array(
            'express_id' => $data['express_id'],
            'province_code'  => $data['province_code']
        );
        $this->db->insert('express_rule', $express_rule);
        $rule_id =  $this->db->insert_id();
        return $rule_id;
    }

    function delete($rule_id) {
        $this->db->where('rule_id', $rule_id);
        return $this->db->delete('express_rule');
    }
}