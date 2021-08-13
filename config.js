let app = {
    user: 'sa',            //用户名
    password: 'Gx123', //密码
    server: '192.168.12.210',
    // server: '127.0.0.1',   //服务器
    database: 'ORGATEX-INTEG',  //数据库
    port: 1433,            //端口默认不用改
    options: {
    encrypt: false // Use this if you're on Windows Azure
    },
    pool: {
        min: 0,
        max: 10,
        idleTimeoutMillis: 3000
    }
  };
   
  module.exports = app;