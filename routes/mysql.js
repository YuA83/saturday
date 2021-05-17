const mysql = require('mysql2');

const client = mysql.createConnection({
    host: 'saturday.cafe24app.com',
    user: '',
    password: '',
    database: '',
    port: '3306',
    multipleStatements: true,   // 한번에 여러 쿼리 사용 가능
},(err)=>{
    console.log('error')
});

module.exports = client;