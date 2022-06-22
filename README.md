# connectionSQL 暂命名

### 作者 : 包匪
    
# 项目介绍
    本项目是针对与 nodejs 连接 mysql 数据库的方法进行封装
    无需再写烦人的sql语句，众多简单易懂上手容易的方法，等你来使用 \(￣︶￣*\))
    
# 环境依赖
    NodeJs
    Express
    Mysql

# 目录结构描述
    ├── READNME.md      // 帮助文档
     
    ├── bin             // 项目主体
    
    │   ├── config      // 配置方法
    
    │   ├── conection  // 所有涉及到直接连接数据库的操作
    
    │   ├── method     // 提供给使用者的函数

    │   ├── spilce     // 格式化 select 语句

    │   ├── tools      // 工具方法

    │   └── index.js       // 将可使用的方法包装并暴露
    
    └── index.js       // 出口文件

# 使用说明

### 首先来介绍一下对象api:
    查询方法
        select  (查询)
        inset   (插入)
        update  (更新)
        delete  (删除)
    事务对象
        services
    配置方法
        config  (数据库信息)
        creatPool (连接池)
        creaConnection (普通连接)

### 基本的使用:
    
#### 在基本查询方法的使用时都需要传入两个参数 一个查询条件 一个回调函数 以下是简单的构造：
    
    connectionSQl.方法(查询条件,回调函数(返回值,报错)=>{ 代码块 })

##### 查询条件必须为对象格式 我推荐在外部创建一个变量来设置查询的条件然后将其引用，这样代码好看些
#### 回调函数可以使用箭头函数传入，需要接受两个参数：
        result => 返回值
            返回值有个固定属性 select => 查询语句，这个属性会把最终的sql语句返回出来供调整。
            其他属性会更具查询类型不同而改变
        error => 报错
            这个就是报错 会截取sql报错中的重要部分返回

#### 下面是一个简单的实例 
        // 查询 user 表中所有的数据并打印
        let select={    
            table:"user"
        }
        connectionSQL.select(select,(result,error)=>{
            if(error)
            {   
                console.log(error) 
            }else if(result){
                console.log(error);
            }
        })  
    
#### 我想分享一个小技巧 就是可以在查询条件中使用es6的模板语法，一下一个简单实列

        // 将表中 name 为包匪的数据改为船长
        let old_data = {
            name:"包匪"
        }
        
        let new_data = {
            name:"船长"
        }        

        let update = {  
            table:"user",
            key:"name",
            value:`"${new_data.name}"`,
            where:`name="${old_data.name}"`
        }
    
        connectionSQL.update(update,(result,error)=>{})

#### 但是还是要注意字符串类型的数据需要被双引号包裹 以后说不定会加以改进

### 返回值:
    返回值是将查询结果进行抽取，包装然后返回吗，基本构成如下
    
    result : {

        // select 查询结果 目前只存在于 select方法的返回值中
        data : {}，
            单个结果为对象 
                data : {
                    name:"包匪"
                }，

            多个结果为数组
                data : [
                    {
                        name:"包匪"
                    },
                    {
                        name:"小恐龙"
                    }
                ]

            没有结果为null
                data:null

        // 存在于 增 删 改 的返回值 主要目的是返回操作的结果 
        // 返回类型为对象格式 以下为一次插入数据的返回结果 结果并不唯一
        message : {
            fieldCount: 0,
            affectedRows: 1,
            insertId: 0,
            serverStatus: 2,
            warningCount: 0,
            message: '',
            protocol41: true,
            changedRows: 0
        },

        // 存在于修改时的返回值 之所以单独提出 changeRows 和 fieldCount 是方便使用者查询
        changeRows: 1,
        fieldCount: 0,

        // 存在于修改时的返回值 会显示使用者修改了哪个数据 以及新值 
        // 本来想写成 旧值 => 新值 但需要再查询表 所以没写
            // 懒
        change: 'name => "包船长"',
    }

### 引入:
    const connection = require("connectionSQL");

### 配置(中间件):
    // connection的配置
    const local = {
        host: "localhost", // 连接地址
        user: "root",       // 连接账号
        password: "root",   // 连接密码
        database: "lemontea",   // 数据库
        port : 3306 // 端口 默认3306
    }

    // 配置connectionSQL
    apply.use( connection.config(local) );

### 设置连接类型(中间件):
    // 只需要设置一次 不会影响到其他方法的使用

    // 所有连接类型为连接池
    apply.use( connection.createPool() )
    // 所有连接类型为普通连接 
    apply.use( connection.creatConnection() )

## 基本方法:

### 查询:
#### 简单查询:
        // 引入模块
        const connection = require('connectionSQL');
    
        // 查询语法
        let select = {
            // 表名
            table : "user", 
            
            // 查询目标 可不选 默认为 *
            query: "user_header", 
    
            // 查询条件 可不选
            where : `user_id = ${request.id}`,  
    
            // 分页查询 可不选
                length => 每页长度
            
                start => 开始下标 
                end => 结束下标
    
            limit: {
                 length: 8
                // start : 0,
                // end : 1
            }
    
        }
    
        // 查询
        connection.select(select,(result,error)=>{})

#### 复杂查询:
    // 引入模块
    const connection = require('connectionSQL');

    // 查询语句
    let select = {

        // 多表联查
            // type => 联查方式 || 默认内连接
                    left => 左连接
                    right   => 右链接
                    inner   => 内连接
            // name =>  表名
            // on => 联查条件
        table: [
            // 第一张表只需要 name
            {name:"video AS v"},
            {type:"left",name:"video_attribution AS a",on:"v.video_id=a.video_id"},
            {type:"left",name:"user AS u",on:"u.user_id = a.author_id"},
        ],

        // 多个查询目标
            // 数组格式输入查询目标即可，可写部分复杂语法，以下展示了一类
        query:[             
            "v.video_id",
            "v.video_name",
            "v.video_src",
            "v.video_duration",
            "v.video_brief",
            "u.user_name",
            "v.video_update",
            "( SELECT COUNT(*) AS counts FROM video_watch AS w WHERE w.video_id=v.video_id) AS watch_volume ",
            "( SELECT COUNT(*) AS counts FROM video_comment AS c WHERE c.video_id=v.video_id) AS comment_volume "
        ],
        
        // 多个查询条件 数组形式输入条件即可
        where:[
            `v.video_id=${req.query.id}`,
            `v.video_id=${req.query.id}`
        ],
    }

    // 查询
    connection.select(select,(result,error)=>{})

### 插入:
    // 引入模块
    const connection = require('connectionSQL');
    
    // 插入语句
    let inset = {

        // 表名
        table : "user",
        
        // 数组格式的数据
        // 字符串类型数注意要用 '' `` 包裹住 "data" 不然会报错
            // 数组格式输入数据，顺序和数组长度需要符合表结构
        data:[ ' "data" ' ,1,2],
    
        // 对象格式的数据
            // 相当于 inset 中的完整语法格式 
            // 属性名为字段名 属性值为相对应的数据
        data:{
            name:'"包匪"',
            age:17
        }
    }

    
    // 插入
    connection.select(inset,(result,error)=>{})

### 修改:
    // 引入模块
    const connection = require('connectionSQL');

    // 修改条件
    let update = {
        // 表名
        table:"user",
        // 修改的字段
        key:"name",
        // 新值
        value:'"包船长"',
        where:'name="包匪"'
    }

    // 修改
    connection.update(update,(res,err)=>{})

### 删除:
#### 简单删除:
    // 引入模块
    const connection = require('connectionSQL');
    
    // 插入语句
    let deletes = {
        // 表名
        table:"user_type",
        // 删除条件
        where:"user_type=1"
    }

    
    // 删除
    connection.select(inset,(result,error)=>{})


### 事务对象: 
#### 自带查询函数中会自动开启事务并且会提交与出错回滚，无需重复开启。
#### 如 select update inset delete  方法

    // 引入
    const connection = require('connectionSQL');

    // 事务对象
    connection.services
    
    // 开启事务
    connection.services.begin()

    // 事务提交
    connection.services.commit()

    // 事务回滚
    connection.services.rollback()

    // 关闭自动提交
    connection.services.setAutoCommitOff()

    // 开启自动提交
    connection.services.setAutoCommitOn()
# 版本内容更新
 
=======
###### v 1.0.0:
    已经将基本用法做出来啦，目前还在继续优化和改善。
    后期会兼容包括但不仅限于：
        创建与修改视图
        创建与修改表格
        创建与修改存储过程
        创建与修改查询函数
        优化查询方式

