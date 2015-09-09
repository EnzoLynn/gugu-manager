<?php
/**
 * Created by PhpStorm.
 * User: 周
 * Date: 2015/9/1
 * Time: 15:05
 */
class Area_model extends CI_Model {
    function __construct() {
        parent::__construct();
    }

    function getOne($area_code) {
        $this->db->where('area_code', $area_code);
        $query = $this->db->get('area');
        return $query->first_row();
    }
}