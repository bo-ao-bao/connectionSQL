// 配置
let configs;

/**
 * 工具类 用于操作模块的配置
 */

class config{

    /**
     * 配置
     * @param {Object} config 配置信息
     * @return 返回一个中间件
     * */
    config(config) {

        // 如果形参为对象原型链
        if (config instanceof Object){
            // 解析为字符串格式
            configs = config;
        }else {
            // 不为对象格式则报错
            throw "please enter json format config your connection ^-^";
        }

        // 返回一个方法 中间件必备
        return function (req, res, next) {
            return next();
        }

    }

    /**
     * 获取到配置
     * */
    getConfig(){
       return configs;
    }
}


const c = new config();
module.exports = c;