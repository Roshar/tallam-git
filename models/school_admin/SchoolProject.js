const mysql = require('mysql2/promise')
const bcrypt = require('bcryptjs')
const { v4: uuidv4 } = require('uuid'); 


/**
 * ######################  SELECT ROWS IN SQL #################################
 * ############################################################################
 */


/** GET PROJECTS IN USE THIS SCHOOL */

exports.getAllProjectsWithThisSchool = async (req,res) => {
    try{
       const dbh = await mysql.createConnection({
          host: process.env.DATABASE_HOST,
          
          user: process.env.DATABASE_USER,
          database: process.env.DATABASE,
          password: process.env.DATABASE_PASSWORD,
          
       })
 
       const school_id = await req.school_id;
       const [result, fields] = await dbh.execute("SELECT * FROM  `middleware_project_school` " + 
       "INNER JOIN `projects`  ON middleware_project_school.project_id = projects.id_project WHERE school_id = ?", [school_id])
 
       dbh.end()
       return result;
    }catch(e) {
       console.log(e.message)
    }
 }
 /** END BLOCK ----------------------------------------  */



/** GET PROJECT DATA BY ID */

 exports.getInfoFromProjectById = async (req, res) => {

    try {
       const dbh = await mysql.createConnection({
          host: process.env.DATABASE_HOST,
          
          user: process.env.DATABASE_USER,
          database: process.env.DATABASE,
          password: process.env.DATABASE_PASSWORD,
          
       })
 
       const project_id = await req.project_id
 
       const [result, fields2] = await dbh.execute('SELECT  * FROM projects WHERE id_project = ? ', [project_id])
      
       dbh.end()
       return result;
    }catch(e) {
       console.log(e.message)
    }
 }

 /** END BLOCK ----------------------------------------  */



 /** GET ALL TEACHERS FROM THIS SCHOOL BY SCHOOL ID */

exports.getAllTeachersFromThisSchoolFromCurrentProject = async (req,res) => {

   try{
      const dbh = await mysql.createConnection({
         host: process.env.DATABASE_HOST,
         
         user: process.env.DATABASE_USER,
         database: process.env.DATABASE,
         password: process.env.DATABASE_PASSWORD,
         
      })

      const school_id = await req.id_school;
      const project_id = await req.id_project;

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

      const [result, fields] = await dbh.execute(" SELECT teachers.id_teacher, teachers.firstname, teachers.surname, teachers.patronymic, teachers.position, position.title_position, position.id_position "+
      " FROM "+name_table_project+" as mpt INNER JOIN teachers ON mpt.teacher_id = teachers.id_teacher "+
      " INNER JOIN position ON teachers.position = position.id_position"+
      " WHERE teachers.school_id = ? AND mpt.in_project_status = ? ", [school_id, 2])
 
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

 exports.deleteFromCurrentProjectByChangeStatus = async (req, res) => {
   try{
      const dbh = await mysql.createConnection({
         host: process.env.DATABASE_HOST,
         
         user: process.env.DATABASE_USER,
         database: process.env.DATABASE,
         password: process.env.DATABASE_PASSWORD,
         
      })

      const teacher_id = await req.teacher_id;
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



 /** UPDATE STATUS in column IN_PROJECT_STATUS (delete in current project)*/

exports.addCurrentProjectByChangeStatus = async (req, res) => {
   try{
      const dbh = await mysql.createConnection({
         host: process.env.DATABASE_HOST,
         
         user: process.env.DATABASE_USER,
         database: process.env.DATABASE,
         password: process.env.DATABASE_PASSWORD,
         
      })

      const teacher_id = await req.teacher_id;
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



 