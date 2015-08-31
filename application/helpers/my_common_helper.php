<?php
/**
 * Created by PhpStorm.
 * User: 周
 * Date: 2015/8/26
 * Time: 9:30
 */
if ( ! defined('BASEPATH')) exit('No direct script access allowed');

function loadExcel($filename, $pars) {
    $pars_default = array(
        'sheetIndex' => 0,
        'headerKey' => FALSE,       //是否用第一列的列名作为键，True则自动从第二行开始读取
        'readColumn' => array()     //只读取哪些列
    );
    $pars = array_merge($pars_default, $pars);

//    error_reporting(E_ALL);
//    ini_set('display_errors', TRUE);
//    ini_set('display_startup_errors', TRUE);

    require_once(APPPATH . 'libraries/PHPExcel.php');
    $objPHPExcel = new PHPExcel();

    $objReader = PHPExcel_IOFactory::createReaderForFile($filename);
    $objPHPExcel = $objReader->load($filename);
    $objPHPExcel->setActiveSheetIndex($pars['sheetIndex']);
    $objWorksheet = $objPHPExcel->getActiveSheet();
    $i = 0;
    $temp_rows = array();
    $temp_header = array();
    foreach( $objWorksheet->getRowIterator() as $row ){
        $cellIterator = $row->getCellIterator();
        $cellIterator->setIterateOnlyExistingCells(false);

        if($pars['headerKey'] == FALSE) {//不用读取表头
//            if( $i == 0 && $pars['includeHeader'] == FALSE ){
//                $i++;
//                continue;
//            }
            $temp_row = array();
            foreach($cellIterator as $cell){
                $temp_row[] = trim($cell->getValue());
            }
            $temp_rows[] = $temp_row;
            $i++;
        } else {//以表头为键
            if( $i == 0){
                foreach($cellIterator as $cell){
                    $temp_header[] = $cell->getValue();
                }
                //指定列头必须在excel中
                if(!array_in_array($temp_header, $pars['readColumn'])) {
                    return array();
                }

                $i++;
            } else {
                $temp_row = array();
                foreach($cellIterator as $cell){
                    $temp_row[] = $cell->getValue();
                }
                //$temp_rows[] = array_combine($temp_header, $temp_row);
                $all_row = array_combine($temp_header, $temp_row);
                if($pars['readColumn']) {
                    $temp = array();
                    foreach ($all_row as $key => $val) {
                        if (in_array($key, $pars['readColumn'])) {
                            $temp[$key] = $val;
                        }
                    }
                    $temp_rows[] = $temp;
                }else{
                    $temp_rows[] = $all_row;
                }

                $i++;
            }
        }
    }
    return $temp_rows;
}
//header = array('title' => '标题')
function outputExcel($data, $header, $title = 'Sheet1' , $type = 'xlsx') {
    /** Include PHPExcel */
    require_once(APPPATH . 'libraries/PHPExcel.php');
    // Create new PHPExcel object
    $objPHPExcel = new PHPExcel();
    // Set document properties
    $objPHPExcel->getProperties()->setCreator("Maarten Balliauw")
        ->setLastModifiedBy("Maarten Balliauw")
        ->setTitle("Office 2007 XLSX Test Document")
        ->setSubject("Office 2007 XLSX Test Document")
        ->setDescription("Test document for Office 2007 XLSX, generated using PHP classes.")
        ->setKeywords("office 2007 openxml php")
        ->setCategory("Test result file");

    // Add some data
    $header_length = count($header);
    $rows_length = count($data) + 1;
    //输出头部
    $i = 0;
    foreach ($header as $k => $v) {
        $objPHPExcel->setActiveSheetIndex(0)->setCellValue(chr($i + 65).'1', $v);
        $i++;
    }
    //输出内容
    for ($row = 0; $row < $rows_length; $row++) {
        $i = 0;
        foreach ($header as $k => $v) {
            $objPHPExcel->setActiveSheetIndex(0)->setCellValue(chr($i + 65).($row + 2), $data[$row][$k]);
            $i++;
        }
    }
    // Rename worksheet
    $objPHPExcel->getActiveSheet()->setTitle($title);
    // Set active sheet index to the first sheet, so Excel opens this as the first sheet
    $objPHPExcel->setActiveSheetIndex(0);
    // Redirect output to a client’s web browser (Excel2007)
    header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    header('Content-Disposition: attachment;filename="01simple.xlsx"');
    header('Cache-Control: max-age=0');
    // If you're serving to IE 9, then the following may be needed
    header('Cache-Control: max-age=1');

    // If you're serving to IE over SSL, then the following may be needed
    header ('Expires: Mon, 26 Jul 1997 05:00:00 GMT'); // Date in the past
    header ('Last-Modified: '.gmdate('D, d M Y H:i:s').' GMT'); // always modified
    header ('Cache-Control: cache, must-revalidate'); // HTTP/1.1
    header ('Pragma: public'); // HTTP/1.0

    $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel2007');
    $objWriter->save('php://output');
    exit;
}

if (!function_exists('loadController'))
{
    function loadController($controller, $method = 'index')
    {
        $dirs = explode('/', $controller);
        if(count($dirs) ==  1) {
            require_once(APPPATH . 'controllers/' . $controller . '.php');
            $controller = new $dirs[0]();
        }else if(count($dirs) ==  2) {
            require_once(APPPATH . 'controllers/' . $dirs[0] . '/' . $controller . '.php');
            $controller = new $dirs[1]();
        }else {
            set_status_header(503);
            echo 'Unable to locate the specified class: '.$controller.'.php';
            exit(5); // EXIT_UNK_CLASS
        }
        return $controller->$method();
    }
}
//数组转对象
function arrayToObject($e){
    if( gettype($e)!='array' ) return;
    foreach($e as $k=>$v){
        if( gettype($v)=='array' || getType($v)=='object' )
            $e[$k]=(object)arrayToObject($v);
    }
    return (object)$e;
}
//对象转数组
function objectToArray($e){
    $e=(array)$e;
    foreach($e as $k=>$v){
        if( gettype($v)=='resource' ) return;
        if( gettype($v)=='object' || gettype($v)=='array' )
            $e[$k]=(array)objectToArray($v);
    }
    return $e;
}
// any_in_array() is not in the Array Helper, so it defines a new function
function any_in_array($needle, $haystack) {
    $needle = is_array($needle) ? $needle : array($needle);
    foreach ($needle as $item) {
        if (in_array($item, $haystack)) {
            return TRUE;
        }
    }
    return FALSE;
}
// 前一个数组（可以更多项目）但必须全部在后一个数组里面
function array_in_array($needle, $haystack) {
    $num = count($haystack);
    if ($num == 0) {
        return FALSE;
    }
    $i = 0;
    $needle = is_array($needle) ? $needle : array($needle);
    foreach ($needle as $item) {
        if (in_array($item, $haystack)) {
            $i++;
        }
    }
    if( $num == $i) {
        return TRUE;
    }
    return FALSE;
}
//只获取数组的指定键的数组
function getArrayByKey($data, $keys) {
    $rows = array();
    foreach ($data as $row) {
        $temp = array();
        foreach ($row as $k => $v) {
            if (in_array($k, $keys)) {
                $temp[$k] = $v;
            }
        }
        $rows[] = $temp;
    }
    return $rows;
}
//输出错误消息
function output_error($msg) {
    $json = array(
        'success' => false,
        'data' => [],
        'total' => 0,
        'msg' => $msg,
        'code' => ''
    );
    echo json_encode($json);
    exit;
}