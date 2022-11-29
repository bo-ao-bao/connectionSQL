// 以下拼接方法都将返回结果

class splice {

    /**
     * 拼接 aim 查询目标
     * @param {Array || String} query
     * @returns {String}
     * */
    query(query) {

        let str = "";
        // 拼接 aim  查询目标
        if (query instanceof Array) {
            for (let key in query) {
                if (key == 0) {
                    str += `${query[key]}`;
                } else {
                    str += `,${query[key]}`;
                }
            }
        } else if (query) {
            str += `${query} \n`;
        } else {
            str = "* \n";
        }
        return str;
    }


    /**
     * 拼接 where 查询条件
     * @param {Array || String} where
     * @returns {String}
     * */
    where(where) {
        let str = "";
        if (where instanceof Array) {
            for (let key in where) {
                if (key == 0) {
                    str += `WHERE ${where[key]} \n `;
                } else {
                    str += `AND ${where[key]} \n`;
                }
            }
        } else if (where) {
            str += `WHERE ${where} \n`;
        }
        return str;
    }


    /**
     * 拼接 table 查询的表
     * @param {Array || String} table
     * @returns {String}
     * */
    table(table) {

        let str = "";

        if (table instanceof Array) {
            if (table[1] instanceof Object) {
                for (let key in table) {
                    if (key == 0) {
                        str += `${table[key].name} \n`;
                    } else if (table[key].type == "inner" || !table[key].type) {
                        str += `INNER JOIN ${table[key].name} ON ${table[key].on} \n`;
                    } else if (table[key].type == "left") {
                        str += `LEFT JOIN ${table[key].name} ON ${table[key].on} \n`;
                    } else if (table[key].type == "right") {
                        str += `RIGHT JOIN ${table[key].name} ON ${table[key].on} \n`;
                    }
                }
            } else {
                for (let key in table) {
                    if (key == 0) {
                        str += `${table[key]} \n`;
                    } else {
                        str += `INNER JOIN ${table[key]} \n`;
                    }
                }
            }
        } else if (table) {
            str += `${table} \n`;
        }

        return str;
    }


    /**
     * 拼接 pair 添加数据时需要用到
     * @param {Array || Object} data
     * @returns {String}
     * */
    data(data) {
        let KEY = "";
        let VALUE = "";

        let str = {};

        // 判断和拼接多个 keyValue
        if (data instanceof Array){
            let index = 0;
            for (let key of data) {

                if (index == 0) {
                    VALUE += `${key}`;
                } else {
                    VALUE += `,${key}`;
                }
                index++;
            }
        }else if (data instanceof Object) {
            let index = 0;
            for (let key in data) {

                if (index == 0) {
                    KEY += `${key}`;
                    VALUE += `${data[key]}`;
                } else {
                    KEY += `,${key}`;
                    VALUE += `,${data[key]}`;
                }
                index++;
            }
        }
        str.key = KEY;
        str.value = VALUE;
        return str;
    }


    /**
     * 拼接 limit 设置分页查询
     * @param {Object} limit
     * @return {String}
     * */
    limit(limit){
        return `LIMIT ${limit.start || ""} ${limit.length || ""} ${limit.end || ""}`
    }
    /**
     * 整理好 sql 语句
     * @param {Object} query 需要整理的sql语句
     * @return {Object} 整理完的语句
     * */
    reorganize(query = {}) {

            if (query.query) {
                query.query = this.query(query.query);
            }
            if (query.table) {
                query.table = this.table(query.table);
            }
            if (query.data) {
                query.data = this.data(query.data);
            }
            if (query.where) {
                query.where = this.where(query.where);
            }
            if (query.limit) {
                query.limit = this.limit(query.limit);
            }

            return query;

    }

    /**
     * 将格式化的sql语句进行拼接
     * @param {String} type
     * @param {Object} query
     * @returns {String}
     * */
    splicing(type, query = {}) {

        let SELECT = "";

        switch (type) {
            case "select" :
                SELECT += ` SELECT ${query.query || `* \n`} FROM ${query.table}`;
                break;
            case "update" :
                SELECT += ` UPDATE ${query.table} SET ${query.key}=${query.value}`;
                break;
            case "inset" :
                SELECT += ` INSERT INTO ${query.table}(${query.data.key || ""}) VALUES (${query.data.value})`;
                break;
            case "delete" :
                SELECT += ` DELETE ${query.query} FROM ${query.table}`;
                break;
        }
        if (query.where) {
            SELECT += `\n ${query.where}`
        }
        if (query.group) {
            SELECT += `\n GROUP BY ${query.group}`
        }
        if (query.order){
            SELECT += `\n ORDER BY ${query.order}`

        }
        if (query.limit) {
            SELECT += `\n ${query.limit}`
        }


        return SELECT;
    }
}


/**
 * 工具类 用于对sql语句的整理
 * 所有方法都会返回结果
 * */
const s = new splice();
module.exports = s;


