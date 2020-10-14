const mysql = require('mysql2/promise')
const bcrypt = require('bcryptjs')
const { v4: uuidv4 } = require('uuid'); 

/**
 * ######################  SELECT ROWS IN SQL #################################
 * ############################################################################
 */

/** GET ALL TEACHERS FROM THIS SCHOOL BY SCHOOL ID */

exports.getAllTeachersFromThisSchoolFromCurrentProject = async (req,res) => {

   try{
      const dbh = await mysql.createConnection({
         host: process.env.DATABASE_HOST,
         port: process.env.DATABASE_PORT,
         user: process.env.DATABASE_USER,
         database: process.env.DATABASE,
         password: process.env.DATABASE_PASSWORD,
         socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock'
      })

      const school_id = await req.id;
      const project_id = await req.project_id;

      let name_table_project = null;

      const [projectе, fields1] = await dbh.execute("SELECT * FROM project_middleware_names"); 

      const project_array = [];

      for(let d = 0; d < projectе.length; d++) {
         project_array.push(projectе[d].tbl_name)
      }

      for (let num = 1; num < project_array.length; num ++) {
         if (project_id == num+1) {
            name_table_project = project_array[num]
         }
      }

      const [result, fields] = await dbh.execute(" SELECT teachers.id_teacher, teachers.firstname, teachers.surname, teachers.patronymic "+
      " FROM "+name_table_project+" as mpt INNER JOIN teachers ON mpt.teacher_id = teachers.id_teacher "+
      " WHERE teachers.school_id = ? AND mpt.in_project_status = ? ", [school_id, 2])
 
    dbh.end()
    return result;
 
    }catch(e) {
       console.log(e)
    }  
 }
 
 /** END BLOCK ----------------------------------------  */



/** GET ALL TEACHERS WITHOUT MEMBER LIST IN CURRENT PROJECT */

exports.getAllTeachersNotMembersInCurrentProject = async (req,res) => {

   try{
      const dbh = await mysql.createConnection({
         host: process.env.DATABASE_HOST,
         port: process.env.DATABASE_PORT,
         user: process.env.DATABASE_USER,
         database: process.env.DATABASE,
         password: process.env.DATABASE_PASSWORD,
         socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock'
      })

      const school_id = await req.id;
      const project_id = await req.project_id;

      

      let name_table_project = null;
      const [projectе, fields1] = await dbh.execute("SELECT * FROM project_middleware_names"); 

      const project_array = [];

      for(let d = 0; d < projectе.length; d++) {
         project_array.push(projectе[d].tbl_name)
      }

      for (let num = 1; num < project_array.length; num ++) {
         if (project_id == num+1) {
            name_table_project = project_array[num]
         }
      }
      const [result, fields] = await dbh.execute(" SELECT teachers.id_teacher, teachers.firstname, teachers.surname, teachers.patronymic "+
      " FROM "+name_table_project+" as mpt INNER JOIN teachers ON mpt.teacher_id = teachers.id_teacher "+
      " WHERE teachers.school_id = ? AND mpt.in_project_status = ? ", [school_id, 1])

      // const [result, fields] = await dbh.execute(" SELECT teachers.id_teacher, teachers.firstname, teachers.surname, teachers.patronymic "+
      // " FROM "+name_table_project+" as mpt INNER JOIN teachers ON mpt.teacher_id = teachers.id_teacher "+
      // " WHERE teachers.school_id = ? AND  mpt.project_id = ? AND mpt.in_project_status = ? ", [school_id, project_id, 1])

   dbh.end()

   return result;

   }catch(e) {
      console.log(e)
   }  
}

/** END BLOCK ----------------------------------------  */




/** GET ALL TEACHERS FROM THIS PROJECT BY PROJECT ID */

exports.getAllTeachersFromCurrentProject = async (req,res) => {

   try{
      const dbh = await mysql.createConnection({
         host: process.env.DATABASE_HOST,
         port: process.env.DATABASE_PORT,
         user: process.env.DATABASE_USER,
         database: process.env.DATABASE,
         password: process.env.DATABASE_PASSWORD,
         socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock'
      })

      const project_id = await req.project_id;

      let name_table_project = null;

      const [projectе, fields1] = await dbh.execute("SELECT * FROM project_middleware_names"); 

      const project_array = [];

      for(let d = 0; d < projectе.length; d++) {
         project_array.push(projectе[d].tbl_name)
      }

      for (let num = 1; num < project_array.length; num ++) {
         if (project_id == num+1) {
            name_table_project = project_array[num]
         }
      }

      const [result, fields] = await dbh.execute(" SELECT teachers.id_teacher, teachers.firstname, teachers.surname, teachers.patronymic, teachers.school_id,schools.school_name "+
      " FROM "+name_table_project+" as mpt INNER JOIN teachers ON mpt.teacher_id = teachers.id_teacher "+
      " INNER JOIN schools ON teachers.school_id = schools.id_school"+
      " WHERE  mpt.in_project_status = ? ", [ 2 ])
 
    dbh.end()
    return result;
 
    }catch(e) {
       console.log(e)
    }  
 }
 
 /** END BLOCK ----------------------------------------  */



 /** GET ALL TEACHERS FROM THIS PROJECT BY PROJECT ID AND WITH ALPHABET-FILTER */

exports.getAllTeachersFromCurrentProjectWithFilter = async (req,res) => {

   try{
      const dbh = await mysql.createConnection({
         host: process.env.DATABASE_HOST,
         port: process.env.DATABASE_PORT,
         user: process.env.DATABASE_USER,
         database: process.env.DATABASE,
         password: process.env.DATABASE_PASSWORD,
         socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock'
      })

      const project_id = await req.project_id;

      let name_table_project = null;

      const [projectе, fields1] = await dbh.execute("SELECT * FROM project_middleware_names"); 

      const project_array = [];

      for(let d = 0; d < projectе.length; d++) {
         project_array.push(projectе[d].tbl_name)
      }

      for (let num = 1; num < project_array.length; num ++) {
         if (project_id == num+1) {
            name_table_project = project_array[num]
         }
      }

      const [result, fields] = await dbh.execute(" SELECT teachers.id_teacher, teachers.firstname, teachers.surname, teachers.patronymic, teachers.school_id,schools.school_name "+
      " FROM "+name_table_project+" as mpt INNER JOIN teachers ON mpt.teacher_id = teachers.id_teacher "+
      " INNER JOIN schools ON teachers.school_id = schools.id_school"+
      " WHERE  mpt.in_project_status = ? ", [ 2 ])
 
    dbh.end()
    return result;
 
    }catch(e) {
       console.log(e)
    }  
 }
 
 /** END BLOCK ----------------------------------------  */



 /** GET TEACHERS BY LAST NAME  */

exports.getTeachersByLastNameFilter = async (req,res) => {

   try{
      const dbh = await mysql.createConnection({
         host: process.env.DATABASE_HOST,
         port: process.env.DATABASE_PORT,
         user: process.env.DATABASE_USER,
         database: process.env.DATABASE,
         password: process.env.DATABASE_PASSWORD,
         socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock'
      })

      const project_id = await req.project_id;
      const name = await req.name;

      let name_table_project = null;

      const [projectе, fields1] = await dbh.execute("SELECT * FROM project_middleware_names"); 

      const project_array = [];

      for(let d = 0; d < projectе.length; d++) {
         project_array.push(projectе[d].tbl_name)
      }

      for (let num = 1; num < project_array.length; num ++) {
         if (project_id == num+1) {
            name_table_project = project_array[num]
         }
      }

    

      const [result, fields] = await dbh.execute(" SELECT teachers.id_teacher, teachers.firstname, teachers.surname, teachers.patronymic, teachers.school_id,schools.school_name "+
      " FROM "+name_table_project+" as mpt INNER JOIN teachers ON mpt.teacher_id = teachers.id_teacher "+
      " INNER JOIN schools ON teachers.school_id = schools.id_school"+
      " WHERE  mpt.in_project_status = ?  AND teachers.surname LIKE '%" + req.name + "%' LIMIT 2", [ 2 ]) 
 
    dbh.end()
    return result;
 
    }catch(e) {
       console.log(e)
    }  
 }
 
 /** END BLOCK ----------------------------------------  */




/** SELECT ALL TEACHERS FROM PROJECT BY FIRST SURNAME LETTER AS ID */

exports.selectTeachersByProjectIdAndLatterFilter = async (req,res) => {

   try{
      const dbh = await mysql.createConnection({
         host: process.env.DATABASE_HOST,
         port: process.env.DATABASE_PORT,
         user: process.env.DATABASE_USER,
         database: process.env.DATABASE,
         password: process.env.DATABASE_PASSWORD,
         socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock'
      })

      const project_id = await req.project_id;
      const name = await req.name;

      let name_table_project = null;

      const [projectе, fields1] = await dbh.execute("SELECT * FROM project_middleware_names"); 

      const project_array = [];

      for(let d = 0; d < projectе.length; d++) {
         project_array.push(projectе[d].tbl_name)
      }

      for (let num = 1; num < project_array.length; num ++) {
         if (project_id == num+1) {
            name_table_project = project_array[num]
         }
      }

      const [result, fields] = await dbh.execute(" SELECT teachers.id_teacher, teachers.firstname, teachers.surname, teachers.patronymic, teachers.school_id,schools.school_name "+
      " FROM "+name_table_project+" as mpt INNER JOIN teachers ON mpt.teacher_id = teachers.id_teacher "+
      " INNER JOIN schools ON teachers.school_id = schools.id_school"+
      " WHERE  mpt.in_project_status = ?  AND teachers.surname LIKE '" + req.letter + "%'", [ 2 ]) 
 
    dbh.end()
    return result;
 
    }catch(e) {
       console.log(e)
    }  
 }
 
 /** END BLOCK ----------------------------------------  */



/**
 * ######################  UPDATE ROWS IN SQL #################################
 * ############################################################################
 */

/** UPDATE STATUS in column IN_PROJECT_STATUS (delete in current project)*/

exports.addCurrentProjectByChangeStatus = async (req, res) => {
   try{
      const dbh = await mysql.createConnection({
         host: process.env.DATABASE_HOST,
         port: process.env.DATABASE_PORT,
         user: process.env.DATABASE_USER,
         database: process.env.DATABASE,
         password: process.env.DATABASE_PASSWORD,
         socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock'
      })

      const teacher_id = await req.id;
      const project_id = await req.project_id;
      const school_id = await req.school_id;

      let name_table_project = null;

      const [projectе, fields1] = await dbh.execute("SELECT * FROM project_middleware_names"); 

      const project_array = [];

      for(let d = 0; d < projectе.length; d++) {
         project_array.push(projectе[d].tbl_name)
      }

      for (let num = 1; num < project_array.length; num ++) {
         if (project_id == num+1) {
            name_table_project = project_array[num]
         }
      }
      
      const [result, fields] = 
      await dbh.execute('UPDATE `'+ name_table_project + '` SET project_id = ?, in_project_status = ? WHERE teacher_id = ?  ',
      [ project_id, 2, teacher_id])

      dbh.end()

      return result;

   }catch(e) {
      console.log(e.message)
   }

}

/** END BLOCK ----------------------------------------  */



/** UPDATE STATUS in column IN_PROJECT_STATUS (delete in current project)*/

exports.deleteFromCurrentProjectByChangeStatus = async (req, res) => {
   try{
      const dbh = await mysql.createConnection({
         host: process.env.DATABASE_HOST,
         port: process.env.DATABASE_PORT,
         user: process.env.DATABASE_USER,
         database: process.env.DATABASE,
         password: process.env.DATABASE_PASSWORD,
         socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock'
      })

      const teacher_id = await req.id;
      const project_id = await req.project_id;
      const school_id = await req.school_id;

      let name_table_project = null;

      const [projectе, fields1] = await dbh.execute("SELECT * FROM project_middleware_names"); 

      const project_array = [];

      for(let d = 0; d < projectе.length; d++) {
         project_array.push(projectе[d].tbl_name)
      }

      for (let num = 1; num < project_array.length; num ++) {
         if (project_id == num+1) {
            name_table_project = project_array[num]
         }
      }
      
      const [result, fields] = 
      await dbh.execute('UPDATE `'+ name_table_project + '` SET project_id = ? ,in_project_status = ?  WHERE teacher_id = ? ',
      [ project_id, 1, teacher_id])

      dbh.end()

      return result;

   }catch(e) {
      console.log(e.message)
   }

}

/** END BLOCK ----------------------------------------  */