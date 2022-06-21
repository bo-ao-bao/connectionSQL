"use strict";

const method = require("./method");
const config = require("./config")

/**
 * 出口类 直接继承 方法类
 * 配置在此类配置
 * */
class connectionSQL extends method {


    // 继承父类 method
    constructor() {
        super();
    }

    /**
     * 配置连接
     * 只需要一个配置方法所以单独拎出来
     * */
    config = config.config
}


/**
 * connectionSQL
 * @author 梁智铭
 * @version 0.0.1
 * */
const c = new connectionSQL();
module.exports = c;
