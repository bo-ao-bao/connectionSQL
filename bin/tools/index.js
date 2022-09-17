/**
 * 工具类 用于整理使用者输入的 sql 语句
 * */

    /**
     * 解析数据并传入回调函数
     * @param {String} type
     * @param {Result} re
     * @param {Error} err
     * @param {function} callback
     * */
 exports.parseData =  function parseData(type, re, err,pair, callback) {
        // 初始化返回值
        let result = {};
            result.data = [];

        let error = "";
        // 保留原本的结果
        // result.results = JSON.parse(JSON.stringify(re));
        // 存在报错 记录报错
        if (err) {
            error = err.sqlMessage;
        } else if (re.length == 0) {    //不存在数据
            result.data = null;
        } else if (re.length == 1) {    // 只有一条数据
            // result.data = {};
            // for (let key in re[0]) {
            //     result.data[key] = re[0][key];
            // }

            result.data[0] = re[0];

        } else if (re.length > 1) {     // 多条数据
            for (let key of JSON.parse(JSON.stringify(re))) {
                result.data.push(key);
            }
        } else if (type != "select") {    // 操作类型非查询操作

            // 获取到返回信息
            result.messages = JSON.parse(JSON.stringify(re));

            switch (type){
                // 更新操作
                case "update":{
                    // 提取出个别数据
                    result.changeRows = result.messages.changedRows;
                    result.fieldCount = result.messages.fieldCount;
                    // 受影响数据大于0
                    if (result.messages.changedRows > 0) {     // 更新操作
                        // 将 key value 取出来保存
                        result.change = `${[Object.keys(pair)]} => ${pair[Object.keys(pair)]}`;

                    }else if (result.messages.fieldCount >= 1){
                        // changeRows数据不大于0则证明没有数据改变
                        result.changeMessage = "fields that have not changed =_=";
                    }else{  
                        error = "The field you want to change was not found (@_@)";
                    }
                }break;
            }

        }

        // 响应回调函数
        callback(result, error);

    }


