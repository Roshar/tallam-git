const mysql = require('mysql2/promise')
const mysq2 = require('mysql')
const express = require('express')
const bcrypt = require('bcryptjs')
const { v4: uuidv4 } = require('uuid'); 
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const app = express()


/**
 * ######################  SELECT ROWS IN SQL #################################
 * ############################################################################
 */

/** FIND USER BY EMAIL, PASSWORD   */

exports.getExistsUserInDb = async (req, res) => {
   try{
      const dbh = await mysql.createConnection({
         host: process.env.DATABASE_HOST,
         port: process.env.DATABASE_PORT,
         user: process.env.DATABASE_USER,
         database: process.env.DATABASE,
         password: process.env.DATABASE_PASSWORD,
         socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock'
      })

      const email = await req.email;
      const [res, fields] = await dbh.execute('SELECT * FROM `users` WHERE email = ?', [email])

      dbh.end()
      return res;
   }catch(e) {
      console.log(e.message)
   }
}

/** END BLOCK ----------------------------------------  */

/**
 * ######################  INSERT ROWS IN SQL #################################
 * ############################################################################
 */
/** CREATE SEESION FOR USER MYSQLSTORE   */

exports.sessionStore = (req, res) => {
   try {
      const dbh = mysql2.createConnection({
         host: process.env.DATABASE_HOST,
         port: process.env.DATABASE_PORT,
         user: process.env.DATABASE_USER,
         database: process.env.DATABASE,
         password: process.env.DATABASE_PASSWORD,
         socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock',
            
      })

      const options = {
         checkExpirationInterval: 1000 * 60 * 15,
         expiration: 86400000,
         createDatabaseTable: true,
       };

      const sessionStore = new MySQLStore(options,dbh);

      app.use(session({
         key: 'ninja4',
         secret: 'secret',
         store: sessionStore,
         resave: false,
         saveUninitialized: false
     }))

   }catch(e) {
      console.log(e.message)
   }
}

 

 
