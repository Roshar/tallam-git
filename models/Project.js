const mysql = require('mysql2/promise')
//const config = require('../config')

exports.all = async function () {
   const dbh = await mysql.createConnection({
      host: process.env.DATABASE_HOST,
      user: process.env.DATABASE_USER,
      database: process.env.DATABASE,
      password: process.env.DATABASE_PASSWORD,
      socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock'
   })
   const [res, fields] = await dbh.execute('SELECT * FROM projects WHERE id_project > 1')
   dbh.end()
   console.log('model finished')
   return res;
}





