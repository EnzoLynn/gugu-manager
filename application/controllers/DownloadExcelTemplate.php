<?php
/**
 * Created by PhpStorm.
 * User: 周
 * Date: 2015/8/27
 * Time: 10:38
 */
defined('BASEPATH') OR exit('No direct script access allowed');

class DownloadExcelTemplate extends AdminController
{
    public function __construct() {
        parent::__construct();
    }

    public function index() {

    }

    public function trackingNumberExcel() {
        $header = array(
            '0' => '运单号',
            '1' => '重量',
            '2' => '计费目的网点名称',
            '3' => '计费目的网点代码',
            '4' => '揽收时间',
            '5' => '快递公司'
        );
        outputExcel([], $header, '客户面单号导入模版');
    }

    public function customerNumberExcel() {
        $header = array(
            '0' => '运单号码',
            '1' => '商家代码',
            '2' => '快递公司'
        );
        outputExcel([], $header, '快递发货单号导入');
    }
}