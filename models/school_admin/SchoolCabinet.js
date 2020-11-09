const mysql = require('mysql2/promise')
const bcrypt = require('bcryptjs')
const { v4: uuidv4 } = require('uuid'); 

/**
 * ######################  SELECT ROWS IN SQL #################################
 * ############################################################################
 */

/** GET DATA ABOUT SCHOOL BY ID  */

exports.getSchoolData = async function (req, res) {
    try{
        const dbh = await mysql.createConnection({
           host: process.env.DATABASE_HOST,
     
           user: process.env.DATABASE_USER,
           database: process.env.DATABASE,
           password: process.env.DATABASE_PASSWORD,
           
        })

        const id_school = await req.school_id
        const [result, fields] = await dbh.execute("SELECT *  FROM `schools` INNER JOIN `area` ON schools.area_id = area.id_area WHERE id_school = ?", [id_school])
  
        dbh.end()
        return result;
     }catch(e) {
        console.log(e.message)
     }
}

/** END BLOCK ----------------------------------------  */



/** GET SUPPORT TYPE  */

exports.getSupportType = async function () {
    try{
        const dbh = await mysql.createConnection({
           host: process.env.DATABASE_HOST,
     
           user: process.env.DATABASE_USER,
           database: process.env.DATABASE,
           password: process.env.DATABASE_PASSWORD,
           
        })

        const [result, fields] = await dbh.execute("SELECT *  FROM `support_type_middleware` ")
  
        dbh.end()
        return result;
     }catch(e) {
        console.log(e.message)
     }
}

/** END BLOCK ----------------------------------------  */



/**
 * ######################  INSERT ROWS IN SQL #################################
 * ############################################################################
 */

/** INSERT NEW MESSAGE IN DB */

exports.insertMessageInDB  = async (req, res) => {
    try {
       const dbh = await mysql.createConnection({
          host: process.env.DATABASE_HOST,
    
          user: process.env.DATABASE_USER,
          database: process.env.DATABASE,
          password: process.env.DATABASE_PASSWORD,
          
       })
    
       const type_id = await req.type_id;
       const email = await req.email;
       const message = await req.message;
       const phone = await req.phone;
 
       const [result, fields] = await dbh.execute('INSERT INTO support_tbl_message (type_id, message, phone, email) VALUES (?,?,?,?)',[type_id, message, phone, email ])
    
       dbh.end()
       return result.insertId;
    }catch(e) {
       console.log(e.message)
    }
 }
 
 /** END BLOCK ----------------------------------------  */









