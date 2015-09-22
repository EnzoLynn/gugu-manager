<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Welcome extends CI_Controller {

    public function __construct() {
        parent::__construct();
        $this->load->model('tracking_number_model');

        $this->load->model('customer_model');

        $this->load->model('customer_rent_model');

        $this->load->model('express_company_model');

        $this->load->model('express_rule_model');
        $this->load->model('express_rule_item_model');
    }

	/**
	 * Index Page for this controller.
	 *
	 * Maps to the following URL
	 * 		http://example.com/index.php/welcome
	 *	- or -
	 * 		http://example.com/index.php/welcome/index
	 *	- or -
	 * Since this controller is set as the default controller in
	 * config/routes.php, it's displayed at http://example.com/
	 *
	 * So any other public methods not prefixed with an underscore will
	 * map to /index.php/welcome/<method_name>
	 * @see http://codeigniter.com/user_guide/general/urls.html
	 */
	public function index() {
		$this->load->view('welcome_message');
	}

    public function zzz() {

        header('Content-Type: application/vnd.ms-excel');
        header('Content-Disposition: attachment;filename="'. date('YmdHis') .'.csv"');
        header('Cache-Control: max-age=0');

        $header = array(
            'tracking_number_id'             => '自动编号',
            'tracking_number'                => '运单号',
            'weight'                           => '重量',
            'arrive_express_point_name'    => '网点名称',
            'arrive_express_point_code'    => '网点代码',
            'arrive_time'                    => '揽收时间',
            'income'                         => '收入（元）',
            'cost'                           => '成本（元）',
            'customer_name'                => '客户名称',
            'account_status_name'         => '结算状态',
            'express_name'                 => '快递公司'
        );

        $data = array(
            'arrive_time_start' => '',
            'arrive_time_end' => '',
            'filter' => array()
        );
        $tracking_numbers = $this->tracking_number_model->getTrackingNumbers($data);

            //查询所有客户
        $all_customers = $this->customer_model->getAllCustomers();

            //查询所有快递
        $all_express = $this->express_company_model->getAllExpress();

        foreach ($tracking_numbers as $key => $val) {
            if($val['account_status'] == 0) {
                 $tracking_numbers[$key]['account_status_name'] = '未结算';
            }else{
                $tracking_numbers[$key]['account_status_name'] = '已结算';
            }
            //客户名字
            //$customer = $this->customer_model->getCustomer($val['customer_id']);
            //$tracking_numbers[$key]['customer_name'] = $customer['customer_name'];
            $tracking_numbers[$key]['customer_name'] = $all_customers[$tracking_numbers[$key]['customer_id']];
            //操作人名字
            $tracking_numbers[$key]['admin_name'] = "test";
            //快递公司名字
            //$express = $this->express_company_model->getOne($val['express_id']);
            //$tracking_numbers[$key]['express_name'] = $express['express_name'];
            $tracking_numbers[$key]['express_name'] = $all_express[$tracking_numbers[$key]['express_id']];
        }

        $rows_length = count($tracking_numbers);


        $fp = fopen('php://output', 'a');

// 输出Excel列名信息
        $head = array_values($header);
        foreach ($head as $i => $v) {
            // CSV的Excel支持GBK编码，一定要转换，否则乱码
            $head[$i] = iconv('utf-8', 'gbk', $v);
            //$head[$i] = $v;
        }
//print_r($tracking_numbers);exit;
// 将数据通过fputcsv写到文件句柄
        fputcsv($fp, $head);

        $count = $rows_length;
        // 计数器
        $i = 0;
        // 每隔$limit行，刷新一下输出buffer，不要太大，也不要太小
        $limit = 10000;
        for ($row = 0; $row < $rows_length; $row++) {
            if ($limit == $i) { //刷新一下输出buffer，防止由于数据过多造成问题
                ob_flush();
                flush();
                $i = 0;
            }
            $rows = array();
            foreach ($header as $k => $v) {
                //iconv('utf-8', 'gbk', $v)
                if ($k == 'tracking_number') {
                    $rows[] = "\t" . iconv('utf-8', 'gbk', $tracking_numbers[$row][$k]);
                } else {
                    $rows[] = iconv('utf-8', 'gbk', $tracking_numbers[$row][$k]);
                }
                //$rows[] = $tracking_numbers[$row][$k];
            }
            fputcsv($fp, $rows);
            unset($rows);
            $i++;
        }
    }
}
