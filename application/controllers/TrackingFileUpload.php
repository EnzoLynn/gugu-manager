<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class TrackingFileUpload extends AdminController {
    public function __construct() {
        parent::__construct();
        $this->load->model('customer_model');
        $this->load->model('file_upload_model');

        $this->load->model('tracking_number_model');
    }

    public function index() {

    }

    public function getOne() {

    }

    public function getList() {
        $data = array(
            'page' => (int)$this->input->post('page'),
            'limit' => (int)$this->input->post('limit'),
            'sort' => $this->input->post('sort'),
            'dir' => $this->input->post('dir'),
            'filter' => objectToArray(json_decode($this->input->post('filter')))
        );

        $files = $this->file_upload_model->getFiles($data);

        foreach ($files as $k => $v) {
            $files[$k]['admin_name'] = $this->admin_name;
            if ($v['validate_status'] == 0) {
                $files[$k]['validate_status_name'] = '未验证';
            } else if ($v['validate_status'] == 2) {
                $files[$k]['validate_status_name'] = '未通过';
            } else {
                $files[$k]['validate_status_name'] = '验证通过';
            }
            if ($v['import_status'] == 0) {
                $files[$k]['import_status_name'] = '未导入';
            } else {
                $files[$k]['import_status_name'] = '已导入';
            }
        }

        $files_total = $this->file_upload_model->getFilesTotal($data);

        $json = array(
            'success' => true,
            'data' => $files,
            'total' => $files_total,
            'msg' => '成功',
            'code' => '01'
        );
        echo json_encode($json);
    }

    public function upload() {
        $config['upload_path']      = './upload/excel/'.date('Ym').'/';
        $config['allowed_types']    = 'xlsx|xls|cvs';
        $config['file_name']        = 'upload_'.date('YmdHis').rand(0,9).rand(0,9).rand(0,9);
        $config['max_size']          = 20480;
        $config['file_ext_tolower'] = TRUE;

        if(!is_dir(FCPATH . $config['upload_path'])) {
            mkdir(FCPATH . $config['upload_path']);
        }
        $this->load->library('upload', $config);

        if ( ! $this->upload->do_upload('fileUpload'))
        {
            $error = array('error' => $this->upload->display_errors());

            print_r($error);
            exit;
        }
        else {
            $fileInfo = $this->upload->data();

            $fileData = array(
                'file_name' => $fileInfo['client_name'],
                'file_save_name' => $fileInfo['file_name'],
                'file_size' => $fileInfo['file_size'],
                'admin_id' => $this->admin_id
            );

            $this->file_upload_model->addFile($fileData);

            $this->file_save_path = FCPATH . $config['upload_path'] . $fileData['file_save_name'];
            output_success();
        }
    }

    public function validate() {
        $file_id = (int)$this->input->get_post('file_id');
        $file = $this->file_upload_model->getFile($file_id);

        $file_dir      = './upload/excel/'.date('Ym', strtotime($file['created_at'])).'/';

        $file_path = FCPATH . $file_dir . $file['file_save_name'];

        $tempName = explode('.', $file['file_save_name']);
        $err_file = FCPATH . $file_dir . $tempName[0] .'_error.csv';

        write_log("开始验证 ". $file['file_name'] . " - ". $file['file_save_name']);

        $pars_default = array(
            'sheetIndex' => 0,
            'headerKey' => TRUE,
            'readColumn' => array('运单号', '重量', '计费目的网点名称', '计费目的网点代码', '揽收时间', '快递公司')
        );

        $data = loadExcel($file_path, $pars_default);

        if (!$data) {
            output_error('excel没有数据匹配');
        }

        $repeat_number = $this->tracking_number_model->checkExcelField($data, '运单号');

        if ($repeat_number) {
            //改为未通过
            $upd_data = array(
                'validate_status' => 2
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

        write_log("Excel内部没有重复");

        $msg = $this->tracking_number_model->validateData($data);

        write_log("验证 ". $file['file_name'] . " - ". $file['file_save_name'] . " 完毕\r\n- - - - - - - - - - - - - - - - - - - - - - -");

        if ($msg) {
            //改为未通过
            $upd_data = array(
                'validate_status' => 2
            );
            $this->file_upload_model->update($file_id, $upd_data);

            $header = array(
                'msg'   => '消息'
            );
            saveCSV($msg, $header, $err_file);
            output_error('有错误，验证未通过');
        } else {
            //改为验证通过
            $upd_data = array(
                'validate_status' => 1
            );
            $this->file_upload_model->update($file_id, $upd_data);

            output_success();
        }
    }

    public function import() {
        $file_id = (int)$this->input->get_post('file_id');
        $file = $this->file_upload_model->getFile($file_id);

        if ($file['validate_status'] != 1) {
            output_error('验证通过的才能导入');
        }

        $file_dir      = './upload/excel/'.date('Ym', strtotime($file['created_at'])).'/';
        $file_path = FCPATH . $file_dir . $file['file_save_name'];

        $tempName = explode('.', $file['file_save_name']);
        $err_file = FCPATH . $file_dir . $tempName[0] .'_error.csv';

        write_log("开始导入". $file['file_name']);

        $pars_default = array(
            'sheetIndex' => 0,
            'headerKey' => TRUE,
            'readColumn' => array('运单号', '重量', '计费目的网点名称', '计费目的网点代码', '揽收时间', '快递公司')
        );

        $data = loadExcel($file_path, $pars_default);
        $num = $this->tracking_number_model->importData($data, $file_id);

        write_log("导入 ". $file['file_name'] ." 完成\r\n- - - - - - - - - - - - - - - - - - - - - - -");

        //状态改为导入成功
        $upd_data = array(
            'import_status' => 1,
            'import_time' => date('Y-m-d H:i:s')
        );
        $this->file_upload_model->update($file_id, $upd_data);

        //如果有错误日志文件，就删除
        if (file_exists($err_file)) {
            unlink($err_file);
        }
        output_success('导入成功！', $num);
    }

    public function downloadError() {
        $file_id = (int)$this->input->get_post('file_id');
        $file = $this->file_upload_model->getFile($file_id);

        $file_dir      = './upload/excel/'.date('Ym', strtotime($file['created_at'])).'/';

        $tempName = explode('.', $file['file_save_name']);
        $err_file = FCPATH . $file_dir . $tempName[0] .'_error.csv';

        downloadCSV($err_file);
    }

    public function delete() {
        $file_id = (int)$this->input->get_post('file_ids');
        $file = $this->file_upload_model->getFile($file_id);

        if ($file['import_status'] == 1) {
            output_error('导入成功的文件不能删除');
        }

        $file_dir      = './upload/excel/'.date('Ym', strtotime($file['created_at'])).'/';
        $file_path = FCPATH . $file_dir . $file['file_save_name'];

        $tempName = explode('.', $file['file_save_name']);
        $err_file = FCPATH . $file_dir . $tempName[0] .'_error.csv';

        $this->file_upload_model->delete($file_id);

        if (file_exists($err_file)) {
            unlink($err_file);
        }

        if (file_exists($file_path)) {
            unlink($file_path);
        }
        output_success();
    }

    public function getLastImportFile() {
        $limit = (int)$this->input->get_post('limit');
        if ($limit == 0) {
            $limit = 20;
        }
        $data = array(
            'page' => 1,
            'limit'=> $limit,
            'sort' => 'created_at',
            'dir'  => 'DESC',
            'filter' => array(
                'import_status' => 1
            )
        );
        $files = $this->file_upload_model->getFiles($data);
        $json = array(
            'success' => true,
            'data' => $files,
            'total' => $limit,
            'msg' => '成功',
            'code' => '01'
        );
        echo json_encode($json);
    }
}