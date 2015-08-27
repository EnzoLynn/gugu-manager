<?php
/**
 * Created by PhpStorm.
 * User: 周
 * Date: 2015/8/27
 * Time: 10:38
 */
defined('BASEPATH') OR exit('No direct script access allowed');

class UploadTrackingNumber extends AdminController {
    public function __construct() {
        parent::__construct();
        $this->load->model('express_rule_model');
        $this->load->model('express_rule_item_model');
    }

    public function index() {

    }

    public function upload() {
        $filename = FCPATH . 'upload/excel/test_tracking_number.xlsx';//test2.xlsx

        $pars_default = array(
            'sheetIndex' => 0,
            'headerKey' => TRUE,
            'readColumn' => array('运单号', '重量', '计费目的网点名称', '计费目的网点代码', '揽收时间')
        );

        $data = loadExcel($filename, $pars_default);

        echo '<pre>';
        print_r($data);
    }

    public function validateExcel() {

    }
}