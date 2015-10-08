<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class TrackingFileUploadCli extends CI_Controller {

    var $task;
    var $task_id;

    public function __construct() {
        parent::__construct();
        $this->load->model('customer_model');
        $this->load->model('file_upload_model');

        $this->load->model('tracking_number_model');
        $this->load->model('task_model');
    }

    public function validate_import() {
        $this->task = $this->task_model->getNewTask();
        if (empty($this->task)) {
            echo 'no task' .PHP_EOL;
            exit;
        }

        $file_id = $this->task['file_id'];
        $file = $this->file_upload_model->getFile($file_id);

        $file_dir      = './upload/excel/'.date('Ym', strtotime($file['created_at'])).'/';

        $file_path = FCPATH . $file_dir . $file['file_save_name'];

        if (!file_exists($file_path)) {
            echo 'file not exists' .PHP_EOL;
            exit;
        }

        $tempName = explode('.', $file['file_save_name']);
        $err_file = FCPATH . $file_dir . $tempName[0] .'_error.csv';

        write_log("开始验证 ". $file['file_name'] . " - ". $file['file_save_name']);
        //状态改为进行中
        $this->task_model->update($this->task['task_id'], 2);

        $pars_default = array(
            'sheetIndex' => 0,
            'headerKey' => TRUE,
            'readColumn' => array('运单号', '重量', '计费目的网点名称', '计费目的网点代码', '揽收时间', '快递公司')
        );

        $data = loadExcel($file_path, $pars_default);

        if (!$data) {
            echo 'wrong excel, no data' .PHP_EOL;
            exit;
        }
        //更新总数
        $upd_data = array(
            'item_total' => count($data),
            'status'  => 2//验证中
        );
        $this->file_upload_model->update($file_id, $upd_data);
        //更新总数完毕
        $repeat_number = $this->tracking_number_model->checkExcelField($data, '运单号');

        if ($repeat_number) {
            //改为未通过
            $upd_data = array(
                'status' => 3//验证失败
            );
            $this->file_upload_model->update($file_id, $upd_data);

            $msg = array();
            foreach ($repeat_number as $number) {
                $msg[] = array(
                    'msg' => 'Excel内部重复的运单号：' . $number
                );
            }
            $header = array(
                'msg'   => '消息'
            );
            saveCSV($msg, $header, $err_file);
            output_error('Excel内部运单号重复，验证未通过');
        }

        write_log("Excel内部验证完毕，开始数据库验证 \r\n - - - -  - - - - - - - - - -- - -  -");


        $msg = $this->tracking_number_model->validateData($data, $file_id);

        write_log("验证 ". $file['file_name'] . " - ". $file['file_save_name'] . " 完毕\r\n- - - - - - - - - - - - - - - - - - - - - - -");

        if ($msg) {
            //改为未通过
            $upd_data = array(
                'status' => 3//验证失败
            );
            $this->file_upload_model->update($file_id, $upd_data);

            $header = array(
                'msg'   => '消息'
            );
            saveCSV($msg, $header, $err_file);


            //任务状态改为完成
            $this->task_model->update($this->task['task_id'], 1);
            echo 'error in file' .PHP_EOL;
            exit;
        }
        //改为验证通过
        $upd_data = array(
            'item_total' => count($data),
            'status' => 4//导入中
        );
        $this->file_upload_model->update($file_id, $upd_data);

        write_log("部验证完毕，开始导入数据");

        $num = $this->tracking_number_model->importData($data, $file_id);

        write_log("导入 ". $file['file_name'] ." 完成，共 $num 条记录\r\n- - - - - - - - - - - - - - - - - - - - - - -");

        //状态改为导入成功
        $upd_data = array(
            'status' => 1,//导入成功
            'import_time' => date('Y-m-d H:i:s')
        );
        $this->file_upload_model->update($file_id, $upd_data);

        //任务状态改为完成
        $this->task_model->update($this->task['task_id'], 1);

        //如果有错误日志文件，就删除
        if (file_exists($err_file)) {
            unlink($err_file);
        }
        echo 'import over' .PHP_EOL;
        exit;
    }
}