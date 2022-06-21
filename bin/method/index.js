const connection = require("../connection");

/***
 * 不直接继承连接类是因为有些方法不想让使用者直接访问到
 */

class Method{
    /**
     * 事务对象
     */
    services = connection.services;

    // 创建连接池
    createPool = connection.createPool;

    // 创建连接
    createConnection = connection.creatConnection;


    /**
     * 查询
     * @param {Object} sql sql语句
     * @param {function} callback 回调函数
     * @return {Null} 无返回值
     * */
    select(sql, callback) {
        connection.flow("select", sql, callback);
    }

    /**
     * 添加
     * @param {Object} sql sql语句
     * @param {function} callback 回调函数
     * @return {Null} 无返回值
     * */
    inset(sql,callback) {
        connection.flow("inset", sql, callback);
    }

    /**
     * 修改
     * @param {Object} sql sql语句
     * @param {function} callback 回调函数
     * @return {Null} 无返回值
     * */
    update(sql,callback) {
        connection.flow("update", sql, callback);
    }

    /**
     * 删除
     * @param {Object} sql sql语句
     * @param {function} callback 回调函数
     * @return {Null} 无返回值
     * */
    delete(sql,callback) {
        connection.flow("delete", sql, callback);
    }





}

/**
 * 方法类 可供操作者使用的方法
 * */
module.exports = Method;

