<?php
/**
 * Created by PhpStorm.
 * User: 周
 * Date: 2015/8/26
 * Time: 11:11
 */
defined('BASEPATH') OR exit('No direct script access allowed');

class CustomerNumber extends AdminController
{
    public function __construct()
    {
        parent::__construct();
        $this->load->model('customer_express_rule_model');
        $this->load->model('customer_express_rule_item_model');
    }

    public function index()
    {

    }
}