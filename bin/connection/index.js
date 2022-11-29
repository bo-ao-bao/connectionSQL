
const mysql = require("mysql");
const splice = require("../splice");
const config = require("../config");
const {parseData} = require("../tools");

/** Mysql 原型*/
let _connection;

/** 是否为连接池*/
let _pool;

// 连接数据库所有的方法
class connection {

    SELECT;

    /**
     * 创建连接池
     * */
    createPool(callback) {
        _pool = true;

        _connection = mysql.createPool(config.getConfig());

        callback && callback();

        return function (req,res,next){
            return next()
        }
    }

    /**
     * 创建连接
     * */
    creatConnection(callback) {

        _pool = false;

        _connection = mysql.createConnection(config.getConfig());

        callback && callback();

        return function (req,res,next){
            return next()
        }
    }

    /**
     * 连接流程
     * @param {String} type 查询类型
     * @param {Object} sql sql语句
     * @param {Function} callback 回调函数
     * */
    flow(type, sql, callback) {
        // 不为object则说明使用者还没有连接数据库
        if (! (_connection instanceof Object) ) {
            throw "oops  You haven't created the connection yet x.x";
        }

        // 获取到转义后的sql语句
        if (sql.select){
            this.SELECT = sql.select
        }else {
            this.SELECT = splice.splicing(type, splice.reorganize(sql));
        }

        this.services.begin();   // 事务开始

        let pair = {}; // 键值对

        // 存在 key 和 value
        if (sql.key && sql.value) pair[sql.key] = sql.value;
        else pair = null;

        // 开始连接
        this.connection(type, this.SELECT, pair,(result, error) => {
            if (error) { // 判断查询是否成功
                this.services.rollback()     // 出错回滚
            } else {
                this.services.commit();      // 成功提交
            }
            callback(result, error);    // 响应回调函数
        });
    }


    /**
     * 连接
     * @param {String} type 查询类型
     * @param {String} sql sql语句
     * @param {Object || Array || Null} pair 连接类型
     * @param {Function} callback 连接类型
     * */
    connection(type, sql, pair = {}, callback) {
        // 判断是否为连接池
        if (_pool){
            // 连接池则传入连接对象
            _connection.getConnection((err,con)=>{
                // 调用查询方法
                this.query(con,type,sql,pair,(res,err)=>{
                    // 释放连接池
                    _connection.releaseConnection(con);
                    // 响应回调
                    callback(res,err)
                });
            })

        }else {
            // 不为连接池则不传入连接对象
            this.query(null,type,sql,pair,callback);
        }

    }

    /**
     * 进行查询
     * @param {Object || Null} con 查询对象
     * @param {String} type 查询类型
     * @param {String} sql sql语句
     * @param {Object || Array || Null} pair 连接类型
     * @param {Function} callback 连接类型
     * */
    query(con,type, sql, pair = {}, callback){
        // 判断是否传入了一个连接对象
        const connection = con || _connection;
        // 查询
        connection.query(
            sql,    // => sql 语句
            (error,result) => {
                parseData(   // => 整理好返回结果
                    type,   // 查询类型
                    result, // 结果
                    error,  // 报错
                    pair,   // 存在 pair
                    (res, err) =>{
                        res.select = this.SELECT;
                        callback(res, err);
                    } // 回调中的回调
                )
            // callback(result,error);
            }
        );
    }


    /**
     * 事务对象 用于事务类型操作
     * */
    services = {
        // 开始事务
        begin :()=>{
            _connection.query("BEGIN;");
        },

        // 事务回滚
        rollback :()=>{
            _connection.query("ROLLBACK;");
        },

        // 提交事务
        commit :()=>{
            _connection.query("COMMIT;");
        },

        // 关闭自动提交
        setAutoCommitOff : ()=>{
            _connection.query("SET AUTOCOMMIT=0;");
        },

        // 开启自动提交
        setAutoCommitOn : ()=>{
            _connection.query("SET AUTOCOMMIT=1;");
        }
    }

}

/**
 * 连接类 所有涉及操作数据库对象的操作在这里
 * */
const c = new connection()
module.exports = c;

