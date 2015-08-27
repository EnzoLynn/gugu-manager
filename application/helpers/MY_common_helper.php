<?php
/**
 * Created by PhpStorm.
 * User: 周
 * Date: 2015/8/26
 * Time: 9:30
 */
if ( ! defined('BASEPATH')) exit('No direct script access allowed');

if (!function_exists('load_controller'))
{
    function load_controller($controller, $method = 'index')
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
function any_in_array($needle, $haystack)
{
    $needle = is_array($needle) ? $needle : array($needle);

    foreach ($needle as $item)
    {
        if (in_array($item, $haystack))
        {
            return TRUE;
        }
    }

    return FALSE;
}

// random_element() is included in Array Helper, so it overrides the native function
function random_element($array)
{
    shuffle($array);
    return array_pop($array);
}