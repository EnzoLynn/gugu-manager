<?php
/**
 * Created by PhpStorm.
 * User: 周
 * Date: 2015/9/1
 * Time: 13:36
 */
defined('BASEPATH') OR exit('No direct script access allowed');

class ExpressPoint extends AdminController {

    public function __construct() {
        parent::__construct();
        $this->load->model('area_model');
        $this->load->model('express_company_model');
        $this->load->model('express_point_model');
    }

    public function index() {

    }

    public function getList() {
        $data = array(
            'page' => (int)$this->input->post('page'),
            'limit'=> (int)$this->input->post('limit'),
            'sort' => $this->input->post('sort'),
            'dir'  => $this->input->post('dir'),
            'filter' => objectToArray(json_decode($this->input->post('filter')))
        );
        $express_points = $this->express_point_model->getPoints($data);
        foreach ($express_points as $k => $v) {
            $province = $this->area_model->getOne($v['province_code']);
            $express_points[$k]['province_name'] = $province['area_name'];
        }

        $express_points_total = $this->express_point_model->getPointsTotal($data);

        $json = array(
            'success' => true,
            'data' => $express_points,
            'total' => $express_points_total,
            'msg' => '成功',
            'code' => '01'
        );
        echo json_encode($json);
    }

    public function add() {
        $point = array(
            'express_id'                 => $this->input->post('express_id'),
            'express_point_name'        => $this->input->post('express_point_name'),
            'express_point_code'        => $this->input->post('express_point_code'),
            'province_code'              => $this->input->post('province_code'),
            'area_code'                   => $this->input->post('area_code')
        );

        $this->express_point_model->add($point);
    }

    public function update() {
        $point_id = $this->input->post('point_id');
        $point = array(
            'express_id'                 => $this->input->post('express_id'),
            'express_point_name'        => $this->input->post('express_point_name'),
            'express_point_code'        => $this->input->post('express_point_code'),
            'province_code'              => $this->input->post('province_code'),
            'area_code'                   => $this->input->post('area_code')
        );

        $this->express_point_model->update($point_id, $point);
    }

    public function delete() {
        $point_ids = $this->input->post('point_ids');
        $point_ids = explode(',', $point_ids);
        foreach ($point_ids as $point_id) {
            $this->express_point_model->delete($point_id);
        }
        $json = array(
            'success' => true,
            'data' => [],
            'total' => count($point_ids),
            'msg' => '成功',
            'code' => '01'
        );
        echo json_encode($json);
    }
}
