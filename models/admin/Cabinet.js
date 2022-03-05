const mysql = require('mysql2/promise')
const bcrypt = require('bcryptjs')
const { v4: uuidv4 } = require('uuid'); 

/**
 * ######################  SELECT ROWS IN SQL #################################
 * ############################################################################
 */

/** GET ALL AREA  */

exports.getAllArea = async function () {
   try{
      const dbh = await mysql.createConnection({
         host: process.env.DATABASE_HOST,
         
         user: process.env.DATABASE_USER,
         database: process.env.DATABASE,
         password: process.env.DATABASE_PASSWORD,
         
      })

      const [res, fields] = await dbh.execute('SELECT * FROM area')

      dbh.end()
      return res;
   }catch(e) {
      console.log(e.message)
   }
}

/** END BLOCK ----------------------------------------  */


/** GET AREA ID BY SCHOOL ID  */

exports.getAreaIdBySchoolId = async function (req, res) {
   try{
      const dbh = await mysql.createConnection({
         host: process.env.DATABASE_HOST,
         
         user: process.env.DATABASE_USER,
         database: process.env.DATABASE,
         password: process.env.DATABASE_PASSWORD,
         
      })

      const school_id = await req.id_school

      const [res, fields] = await dbh.execute('SELECT area_id FROM schools WHERE id_school = ?',[school_id])

      dbh.end()
      return res;
   }catch(e) {
      console.log(e.message)
   }
}

/** END BLOCK ----------------------------------------  */



/** GET ALL TYPIES */

exports.getTypes = async function () {
   try{
      const dbh = await mysql.createConnection({
         host: process.env.DATABASE_HOST,
         
         user: process.env.DATABASE_USER,
         database: process.env.DATABASE,
         password: process.env.DATABASE_PASSWORD,
         
      })

      const [res, fields] = await dbh.execute('SELECT * FROM type_school')

      dbh.end()
      return res;
   }catch(e) {
      console.log(e.message)
   }
}

/** END BLOCK ----------------------------------------  */



/** GET SCHOOL BY AREA ID (FROM AREA ID) */

exports.getSchoolsByAreaId = async function (req, res) {
   try {
      const dbh = await mysql.createConnection({
         host: process.env.DATABASE_HOST,
         
         user: process.env.DATABASE_USER,
         database: process.env.DATABASE,
         password: process.env.DATABASE_PASSWORD,
         
      })

      const area_id = await req.area_id;
      const [result, fields] = await dbh.execute('SELECT * FROM schools  WHERE area_id = ?',[area_id])

      dbh.end()
      return result;
   }catch(e) {
      console.log(e.message)
   }
}

/** END BLOCK ----------------------------------------  */



/** GET SCHOOL BY AREA ID (FROM AREA ID) AND CHECK ISSET PROJECT BY SCHOOL ID */

exports.getSchoolFromCurrentProject = async function (req, res) {
   try {
      const dbh = await mysql.createConnection({
         host: process.env.DATABASE_HOST,
         
         user: process.env.DATABASE_USER,
         database: process.env.DATABASE,
         password: process.env.DATABASE_PASSWORD,
         
      })
      
      const project_id = await req.project_id || await req.id;

      const [result, fields] = await dbh.execute('SELECT * FROM middleware_project_school'+
      ' as mps WHERE mps.project_id = ?',[project_id])

      dbh.end()
      return result;
   }catch(e) {
      console.log(e.message)
   }
}

/** END BLOCK ----------------------------------------  */



/** GET USER BY EMAIL (FOR CHECKING UNIQUE EMAIL) */

exports.getUserByEmail = async (req, res) => {
   try{
      const dbh = await mysql.createConnection({
         host: process.env.DATABASE_HOST,
         
         user: process.env.DATABASE_USER,
         database: process.env.DATABASE,
         password: process.env.DATABASE_PASSWORD,
         
      })

      const email = await req.email;
      const [result, fields] = await dbh.execute('SELECT * FROM users WHERE email = ?',[email])

      dbh.end()
      return result;
   }catch(e) {
      console.log(e.message)
   }

}

/** END BLOCK ----------------------------------------  */



/** GET LEVEL EDUCATION  */

exports.getLevelEdu = async () => {
   try{
      const dbh = await mysql.createConnection({
         host: process.env.DATABASE_HOST,
         
         user: process.env.DATABASE_USER,
         database: process.env.DATABASE,
         password: process.env.DATABASE_PASSWORD,
         
      })

      const [res, fields] = await dbh.execute('SELECT * FROM edu_level')

      dbh.end()
      return res;
   }catch(e) {
      console.log(e.message)
   }
   
}

/** END GET LEVEL EDUCATION */



/** GET ALL SCHOOLS PROFILE */
//LIMITED 10 ROWS LAST ADDED SCHOOLS

exports.getAllSchoolProfiles = async () => {
   try{
      const dbh = await mysql.createConnection({
         host: process.env.DATABASE_HOST,
         
         user: process.env.DATABASE_USER,
         database: process.env.DATABASE,
         password: process.env.DATABASE_PASSWORD,
         
      })

      const [res, fields] = await dbh.execute('SELECT * FROM schools LIMIT 10')

      dbh.end()
      return res;
   }catch(e) {
      console.log(e.message)
   }
   
}

/** END BLOCK ----------------------------------------  */



/** GET ALL SCHOOLS WITH AREAS TITLES */

exports.getAllSchoolWithAreas = async () => {
   try{
      const dbh = await mysql.createConnection({
         host: process.env.DATABASE_HOST,
         
         user: process.env.DATABASE_USER,
         database: process.env.DATABASE,
         password: process.env.DATABASE_PASSWORD,
         
      })

      const [res, fields] = await dbh.execute('SELECT schools.id_school, schools.area_id, schools.school_name,  schools.type_id, area.id_area, area.title_area FROM schools INNER JOIN area ON schools.area_id = area.id_area')

      dbh.end()
      return res;
   }catch(e) {
      console.log(e.message)
   }
   
}

/** END BLOCK ----------------------------------------  */



/** GET GENDER */

exports.getGenders = async () => {
   try{
      const dbh = await mysql.createConnection({
         host: process.env.DATABASE_HOST,
         
         user: process.env.DATABASE_USER,
         database: process.env.DATABASE,
         password: process.env.DATABASE_PASSWORD,
         
      })

      const [res, fields] = await dbh.execute('SELECT * FROM gender')

      dbh.end()
      return res;
   }catch(e) {
      console.log(e.message)
   }
}

/** END BLOCK ----------------------------------------  */



/**  POSITION LIST */

exports.getPositionList = async () => {
   try{
      const dbh = await mysql.createConnection({
         host: process.env.DATABASE_HOST,
         
         user: process.env.DATABASE_USER,
         database: process.env.DATABASE,
         password: process.env.DATABASE_PASSWORD,
         
      })

      const [res, fields] = await dbh.execute('SELECT * FROM position')

      dbh.end()
      return res;
   }catch(e) {
      console.log(e.message)
   }
   
}

/** END BLOCK ----------------------------------------  */



/**  DISICPLINES LIST */

exports.getdisciplinesList = async () => {
   try{
      const dbh = await mysql.createConnection({
         host: process.env.DATABASE_HOST,
         
         user: process.env.DATABASE_USER,
         database: process.env.DATABASE,
         password: process.env.DATABASE_PASSWORD,
         
      })

      const [res, fields] = await dbh.execute('SELECT * FROM discipline_title')

      dbh.end()
      return res;
   }catch(e) {
      console.log(e.message)
   }
   
}

/** END BLOCK ----------------------------------------  */



/**  DISICPLINES LIST */

exports.getCategories = async () => {
   try{
      const dbh = await mysql.createConnection({
         host: process.env.DATABASE_HOST,
         
         user: process.env.DATABASE_USER,
         database: process.env.DATABASE,
         password: process.env.DATABASE_PASSWORD,
         
      })

      const [res, fields] = await dbh.execute('SELECT * FROM category')

      dbh.end()
      return res;
   }catch(e) {
      console.log(e.message)
   }
   
}

/** END BLOCK ----------------------------------------  */



/** SCHOOL PROFILE */

exports.getSchoolProfileById = async (req,res) => {
   try{
      const dbh = await mysql.createConnection({
         host: process.env.DATABASE_HOST,
         
         user: process.env.DATABASE_USER,
         database: process.env.DATABASE,
         password: process.env.DATABASE_PASSWORD,
         
      })

      const id_school = await req.id;
      const [result, fields] = await dbh.execute("SELECT *  FROM `schools` INNER JOIN `area` ON schools.area_id = area.id_area WHERE id_school = ?", [id_school])

      dbh.end()
      return result;
   }catch(e) {
      console.log(e.message)
   }
}

/** END BLOCK ----------------------------------------  */



/** GET PROJECTS IN USE THIS SCHOOL */

exports.getAllProjectsWithThisSchool = async (req,res) => {
   try{
      const dbh = await mysql.createConnection({
         host: process.env.DATABASE_HOST,
         
         user: process.env.DATABASE_USER,
         database: process.env.DATABASE,
         password: process.env.DATABASE_PASSWORD,
         
      })

      const school_id = await req.id;
      const [result, fields] = await dbh.execute("SELECT * FROM  `middleware_project_school` " + 
      "INNER JOIN `projects`  ON middleware_project_school.project_id = projects.id_project WHERE school_id = ?", [school_id])

      dbh.end()
      return result;
   }catch(e) {
      console.log(e.message)
   }
}
/** END BLOCK ----------------------------------------  */



/** GET ALL TEACHERS FROM THIS SCHOOL BY SCHOOL ID */

exports.getAllTeachersFromThisSchool = async (req,res) => {

   try{
      const dbh = await mysql.createConnection({
         host: process.env.DATABASE_HOST,
         
         user: process.env.DATABASE_USER,
         database: process.env.DATABASE,
         password: process.env.DATABASE_PASSWORD,
         
      })

      const school_id = await req.id;
      const [result, fields] = await dbh.execute("SELECT teachers.id_teacher, teachers.surname, teachers.firstname, teachers.patronymic, teachers.phone, teachers.email,"+
      "position.title_position FROM  `teachers` " + 
      "INNER JOIN `position` ON teachers.position = position.id_position "+
      "WHERE teachers.school_id = ?", [school_id])

   dbh.end()
   return result;

   }catch(e) {
      console.log(e)
   }  
}

/** END BLOCK ----------------------------------------  */



/** GET PROFILE INFORMATION TEACHER BY ID */

exports.getProfileByTeacherId = async (req, res) => {
   try{
      const dbh = await mysql.createConnection({
         host: process.env.DATABASE_HOST,
         
         user: process.env.DATABASE_USER,
         database: process.env.DATABASE,
         password: process.env.DATABASE_PASSWORD,
         
      })

      const school_id = await req.id;
      const teacher_id = await req.teacher_id;
      const [result, fields] = await dbh.execute("SELECT teachers.id_teacher, teachers.surname, "+
      "teachers.firstname, teachers.patronymic, teachers.birthday, teachers.snils, teachers.gender_id, teachers.specialty,  "+
      "teachers.level_of_education_id, teachers.diploma, teachers.position, teachers.total_experience, teachers.teaching_experience, teachers.category_id, teachers.phone, teachers.email, teachers.avatar, "+
      "position.title_position, edu_level.title_edu_level, category.title_category, gender.id_gender, gender.gender_title "+
      "FROM  `teachers` " + 
      "INNER JOIN `position` ON teachers.position = position.id_position "+
      "INNER JOIN `edu_level` ON teachers.level_of_education_id = edu_level.id_edu_level "+
      "INNER JOIN `category` ON teachers.category_id = category.id_category "+
      "INNER JOIN `gender` ON teachers.gender_id = gender.id_gender "+
      "WHERE teachers.id_teacher = ?", [teacher_id]);

   dbh.end()
   return result;

   }catch(e) {
      console.log(e)
   }
}

/** END BLOCK ----------------------------------------  */



/** GET INFORMATION ABOUT KPK TEACHER BY ID TEACHER  */

exports.getAllKpkByIdTeacher = async(req, res) => {
   try {
      const dbh = await mysql.createConnection({
         host: process.env.DATABASE_HOST,
         
         user: process.env.DATABASE_USER,
         database: process.env.DATABASE,
         password: process.env.DATABASE_PASSWORD,
         
      })

      const teacher_id = await req.teacher_id
      const [result, fields2] = await dbh.execute('SELECT * FROM training_kpk WHERE teacher_id = ?', [teacher_id])
     
      dbh.end()
      return result;
   }catch(e) {
      console.log(e.message)
   }
}

/** END BLOCK ----------------------------------------  */



/** GET TEACHER DISCIPLINES (ALL) BY TEACHER ID  */

exports.getTeacherDisciplines = async(req, res) => {
   try {
      const dbh = await mysql.createConnection({
         host: process.env.DATABASE_HOST,
         
         user: process.env.DATABASE_USER,
         database: process.env.DATABASE,
         password: process.env.DATABASE_PASSWORD,
         
      })

      const teacher_id = await req.teacher_id
      const [result, fields2] = await dbh.execute('SELECT * FROM `discipline_middleware` '+
      ' INNER JOIN `discipline_title` ON discipline_middleware.discipline_id = discipline_title.id_discipline'+
      ' WHERE discipline_middleware.teacher_id = ?', [teacher_id])
     
      dbh.end()
      return result;
   }catch(e) {
      console.log(e.message)
   }
}

/** END BLOCK ----------------------------------------  */


///////////////////////////////////////// PROJECTS //////////////////////////////////

/** GET ALL PROJECTS FOR ADMIN PANEL */

exports.getAllProjects = async function () {
   const dbh = await mysql.createConnection({
      host: process.env.DATABASE_HOST,
      user: process.env.DATABASE_USER,
      database: process.env.DATABASE,
      password: process.env.DATABASE_PASSWORD,
      
   })
   const [res, fields] = await dbh.execute('SELECT * FROM projects WHERE id_project > 1')
   dbh.end()
   return res;
}
/** END BLOCK ----------------------------------------  */



/** GET PROJECTS WHAT USE THIS TEACHER (ALL)  */

exports.getTeacherProjects = async(req, res) => {
   try {
      const dbh = await mysql.createConnection({
         host: process.env.DATABASE_HOST,
         
         user: process.env.DATABASE_USER,
         database: process.env.DATABASE,
         password: process.env.DATABASE_PASSWORD,
         
      })

      const teacher_id = await req.teacher_id
      const [result, fields2] = await dbh.execute('SELECT  table_members.project_id, projects.name_project, projects.id_project FROM `table_members` '+
      ' INNER JOIN `projects` ON table_members.project_id = projects.id_project'+
      ' WHERE table_members.teacher_id = ?', [teacher_id])
     
      dbh.end()
      return result;
   }catch(e) {
      console.log(e.message)
   }
}

/** END BLOCK ----------------------------------------  */



/** GET ALL SCHOLS WITH AREA FROM PROJECT BY PROJECT ID  */

exports.getAllSchoolsFromThisProjects = async (req, res) => {
   try {
      const dbh = await mysql.createConnection({
         host: process.env.DATABASE_HOST,
         
         user: process.env.DATABASE_USER,
         database: process.env.DATABASE,
         password: process.env.DATABASE_PASSWORD,
         
      })

      const project_id = await req.id;

      const [result, fields2] = await dbh.execute('SELECT  schools.id_school, schools.school_name, schools.type_id, schools.area_id, area.title_area, type_school.title_type, users.status ' +
      ' FROM `schools` '+
      ' INNER JOIN `middleware_project_school` ON schools.id_school = middleware_project_school.school_id '+
      ' INNER JOIN `area` ON schools.area_id  = area.id_area '+
      ' INNER JOIN `type_school` ON schools.type_id = type_school.id_type '+
      ' INNER JOIN `users` ON schools.id_school  = users.school_id '+
      ' WHERE middleware_project_school.project_id = ?', [project_id])
     
      dbh.end()
      return result;
   }catch(e) {
      console.log(e.message)
   }
}

/** END BLOCK ----------------------------------------  */



/** GET PROJECT INFO BY PROJECT ID  */

exports.getInfoFromProjectById = async (req, res) => {

   try {
      const dbh = await mysql.createConnection({
         host: process.env.DATABASE_HOST,
         
         user: process.env.DATABASE_USER,
         database: process.env.DATABASE,
         password: process.env.DATABASE_PASSWORD,
         
      })

      const project_id = await req;

      const [result, fields2] = await dbh.execute('SELECT  * FROM projects WHERE id_project = ? ', [project_id])
     
      dbh.end()
      return result;
   }catch(e) {
      console.log(e.message)
   }
}

/** END BLOCK ----------------------------------------  */



/** GET TOTAL VALUE TEACHERS FROM PROJECT BY PROJECT ID   */

exports.getTotalValueTeacherFromProject = async (req, res) => {
   try {
      const dbh = await mysql.createConnection({
         host: process.env.DATABASE_HOST,
         
         user: process.env.DATABASE_USER,
         database: process.env.DATABASE,
         password: process.env.DATABASE_PASSWORD,
         
      })

      const project_id = await req.id;

      let name_table_project = null;

      // TODO написать вывод из базы 
      // Добавлять в массив новые проекты

      const project_array = ['empty','middleware_teachers_project_name_mark','middleware_teachers_project_name_test']

      for (let num = 1; num < project_array.length; num ++) {
         if (project_id == num+1) {
            name_table_project = project_array[num]
         }
      }

      const [result, fields] = await dbh.execute('  SELECT COUNT(DISTINCT teacher_id) as count FROM '+ name_table_project + ' WHERE project_id = ? AND in_project_status = ?', [project_id, 2])
     
      dbh.end()

      return result;
   }catch(e) {
      console.log(e.message)
   }
}

/** END BLOCK ----------------------------------------  */



/** GET TOTAL VALUE SCHOOLS FROM PROJECT BY PROJECT ID   */

exports.getTotalValueSchoolFromProject = async (req, res) => {
   try {
      const dbh = await mysql.createConnection({
         host: process.env.DATABASE_HOST,
         
         user: process.env.DATABASE_USER,
         database: process.env.DATABASE,
         password: process.env.DATABASE_PASSWORD,
         
      })

      const project_id = await req.id;

      const [result, fields] = await dbh.execute(' SELECT COUNT(DISTINCT school_id) as count FROM middleware_project_school  WHERE project_id = ? ', [project_id])
   
      dbh.end()
      return result;
   }catch(e) {
      console.log(e.message)
   }
}

/** END BLOCK ----------------------------------------  */



/** GET INFORMATION ABOUT TEACHER'S ISSET IN PROJECT BY TEACHER ID  */

exports.getInformationAboutIssetTeacherInProject = async (req, res) => {
   try {
      const dbh = await mysql.createConnection({
         host: process.env.DATABASE_HOST,
         
         user: process.env.DATABASE_USER,
         database: process.env.DATABASE,
         password: process.env.DATABASE_PASSWORD,
         
      })

      const teacher_id = await req.teacher_id;

      const [projectе, fields1] = await dbh.execute("SELECT * FROM project_middleware_names"); 

      const name_table_project = [];

      for(let d = 0; d < projectе.length; d++) {
         name_table_project.push(projectе[d].tbl_name)
      }

      let dataarray = []

      for(let op = 0; op < name_table_project .length; op++ ) {
         let [result, fields] = await dbh.execute('SELECT tbl_name.teacher_id, tbl_name.in_project_status,'+
         ' tbl_name.project_id, projects.name_project FROM `'+ name_table_project[op] +'` as tbl_name '+
         'INNER JOIN projects ON tbl_name.project_id = projects.id_project WHERE tbl_name.teacher_id = ? AND tbl_name.in_project_status = ? ',
         [teacher_id, 2])
        if(result) {
           dataarray.push(result)
        }
      }

      let temp = [];

      for(let p = 0; p < dataarray.length; p++) {
         for(let i of dataarray[p])
          i && temp.push(i);
      }

      dataarray = temp;
      
      dbh.end()
      return dataarray;
   }catch(e) {
      console.log(e.message)
   }
}

/** END BLOCK ----------------------------------------  */



/**
 * ######################  INSERT ROWS IN SQL #################################
 * ############################################################################
 */

/** CREATE NEW CABINET  */

exports.createNewCabinet = async (req, res) => {
   try {
      const dbh = await mysql.createConnection({
         host: process.env.DATABASE_HOST,
         
         user: process.env.DATABASE_USER,
         database: process.env.DATABASE,
         password: process.env.DATABASE_PASSWORD,
         
      })

      const email = await req.email;
      const password = await req.password;
      const area = await req.area;
      const school = await req.school;
      const hashPassword = await bcrypt.hash(password, 7)
      const id_user = '12222';

      const [result, fields] = await dbh.execute('INSERT INTO users (id_user, email, password, school_id) VALUES (?,?,?,?)',[id_user, email, hashPassword, school])
   
      dbh.end()
      return result.insertId;
   }catch(e) {
      console.log(e.message)
   }
}

/** END BLOCK ----------------------------------------  */



/** CREATE NEW SCHOOL (NOT CABINET) */

exports.addNewSchool = async (req, res) => {
   try{
      const dbh = await mysql.createConnection({
         host: process.env.DATABASE_HOST,
         
         user: process.env.DATABASE_USER,
         database: process.env.DATABASE,
         password: process.env.DATABASE_PASSWORD,
         
      })

      const id = uuidv4()
      const school_name = await req.school_name;
      const area_id = await req.area_id;
      const type_id = await req.type_id;
      
      const [result, fields] = 
      await dbh.execute('INSERT INTO schools (id_school,area_id, school_name type_id) VALUES (?,?,?,?,?)',
      [id, area_id, fullname, short_name,  type_id])

      dbh.end()
      return result.insertId;
   }catch(e) {
      console.log(e.message)
   }

}

/** END BLOCK ----------------------------------------  */



/** CREATE A NEW TEACHER IN THIS SCHOOL  */

exports.addNewTeacher = async (req, res) => {
   try{
      console.log('stop')
      return true
      const dbh = await mysql.createConnection({
         host: process.env.DATABASE_HOST,
         
         user: process.env.DATABASE_USER,
         database: process.env.DATABASE,
         password: process.env.DATABASE_PASSWORD,
         
      })

      console.log(req)

      console.log('CabinetTeacher')

      /** sql for teachers table */
      const id_teacher = await req.id_teacher;
      const surname = await req.surname;
      const firstname = await req.firstname;
      const patronymic = await req.patronymic;
      const birthday = await req.birthday;
      const snils = await req.snils;
      const gender_id = await req.gender_id;
      const specialty = await req.specialty;
      const level_of_education_id = await req.level_of_education_id;
      const diploma = await req.diploma;
      const position = await req.position;
      const total_experience = await req.total_experience;
      const teaching_experience = await req.teaching_experience;
      const category = await req.category;
      const phone = await req.phone;
      const email = await req.email;
      /** sql for discipline table */
      const disciplines_id = await req.disciplines;
      /** sql for training_kpk table */
      const place_kpk = await req.place_kpk;
      const year_kpk = await req.year_kpk;
      /** sql for table_members table */
      const school_id = await req.school_id;
      const project_id = await req.project_id;
      
      let name_table_project = null;

      const [projectе, fields1] = await dbh.execute("SELECT * FROM project_middleware_names"); 

      const project_array = [];

      for(let d = 0; d < projectе.length; d++) {
         project_array.push(projectе[d].tbl_name)
      }
      
      //ADD IN PROJECT
      for (let num = 1; num < project_array.length; num ++) {
         if (project_id == num+1) {
            name_table_project = project_array[num]
         }
      }
      for(let op = 0; op < project_array.length; op++ ) {
         if(project_id == op+1) {

            let [result1, fields1] =  await dbh.execute('INSERT INTO `'+ project_array[op] +'` (teacher_id, in_project_status, project_id) VALUES (?,?,?)',
            [id_teacher, 2, op+1])
         }else {
            let [result2, fields2] =  await dbh.execute('INSERT INTO `'+ project_array[op] +'` (teacher_id, in_project_status, project_id) VALUES (?,?,?)',
            [id_teacher, 1, op+1])
         }
      }

            const [result3, fields3] = 
            await dbh.execute('INSERT INTO teachers (id_teacher, surname, firstname, patronymic, birthday, snils, gender_id, specialty, level_of_education_id, diploma, position, total_experience, teaching_experience, category_id, phone,	email, school_id) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
            [id_teacher, surname,firstname, patronymic, birthday, snils, gender_id, specialty,level_of_education_id, diploma, position, total_experience, teaching_experience, category, phone,	email, school_id ])

            for (let i = 0; i < disciplines_id.length; i++) {
               const [result4, fields4] =  await dbh.execute('INSERT INTO discipline_middleware ( teacher_id,	discipline_id) VALUES (?,?)',
               [id_teacher, disciplines_id[i]])
            }

            const [result5 , fields5] =  await dbh.execute('INSERT INTO training_kpk (year_training, place_training, teacher_id) VALUES (?,?,?)',
            [year_kpk,  place_kpk, id_teacher])

      dbh.end()
      return result3.insertId;
      
   }catch(e) {
      console.log(e.message)
   }
}

/** END BLOCK ----------------------------------------  */




/** INSERT SCHOOL IN CURRENT PROJECT */

exports.insertSchoolInProject = async (req, res) => {
   try{
      const dbh = await mysql.createConnection({
         host: process.env.DATABASE_HOST,
         
         user: process.env.DATABASE_USER,
         database: process.env.DATABASE,
         password: process.env.DATABASE_PASSWORD,
         
      })

      const id_project = await req.id;
      const is_school = await req.id_school;

      const [result, fields] = 
      await dbh.execute('INSERT INTO middleware_project_school (school_id, project_id) VALUES (?,?)',
      [is_school, id_project])

      dbh.end()
      return result.insertId;
   }catch(e) {
      console.log(e.message)
   }

}

/** END BLOCK ----------------------------------------  */



/**
 * ######################  UPDATE ROWS IN SQL #################################
 * ############################################################################
 */

/** UPDATE  MAIN INFORMATION TEACHERS'S  BY TEACHER ID*/

exports.updateTeacherMainInformationById  = async (req, res) =>{
   try {
      const dbh = await mysql.createConnection({
         host: process.env.DATABASE_HOST,
         
         user: process.env.DATABASE_USER,
         database: process.env.DATABASE,
         password: process.env.DATABASE_PASSWORD,
         
      })
      
      const id_teacher = await req.id_teacher;
      const surname = await req.surname;
      const firstname = await req.firstname;
      const patronymic = await req.patronymic
      const birthday = await req.birthday;
      const snils = await req.snils;
      const gender_id = await req.gender_id;
      const specialty = await req.specialty;
      const level_of_education_id = await req.level_of_education_id;
      const diploma = await req.diploma;
      const position = await req.position;
      const total_experience = await req.total_experience;
      const teaching_experience = await req.teaching_experience;
      const category = await req.category;
      const phone = await req.phone;
      const email = await req.email;

      const [result, fields] = 
      await dbh.execute("UPDATE `teachers` SET surname = ?, firstname = ?, patronymic = ?,"+
      "birthday = ?,snils = ?, gender_id = ?, specialty = ?, level_of_education_id = ?,"+
      "diploma= ?, position = ?, total_experience = ?,teaching_experience = ?, category_id = ?,"+
      "phone = ?, email = ?  WHERE  id_teacher = ?  ",
      [surname, 
      firstname, 
      patronymic,
      birthday,
      snils,
      gender_id,
      specialty,
      level_of_education_id,
      diploma,
      position,
      total_experience,
      teaching_experience,
      category,
      phone,
      email,
      id_teacher])

      dbh.end()
      return result;

   }catch(e) {
      console.log(e.message)
   }
}

/** END BLOCK ----------------------------------------  */


/**
 * ######################  DELETE ROWS IN SQL #################################
 * ############################################################################
 */

 /** UPDATE  MAIN INFORMATION TEACHERS'S  BY TEACHER ID*/

exports.deleteTeacherProfileById = async(req , res) => {
   try{
      const dbh = await mysql.createConnection({
         host: process.env.DATABASE_HOST,
         
         user: process.env.DATABASE_USER,
         database: process.env.DATABASE,
         password: process.env.DATABASE_PASSWORD,
         
      })

      console.log('DeleteCabinet')

      const teacher_id = await req.teacher_id;
      const school_id = await req.school_id;

      const [projectе, fields1] = await dbh.execute("SELECT * FROM project_middleware_names"); 

      const name_table_project = [];

      for(let d = 0; d < projectе.length; d++) {
         name_table_project.push(projectе[d].tbl_name)
      }

      if(!teacher_id ||  !school_id) {
         throw new Error('Неверне параментры! Какой то из параментров отсутствует!')
      }else {
         const [result, fields] = 
         await dbh.execute('DELETE FROM `teachers` WHERE id_teacher = ?',
         [teacher_id])

         const [result2, fields2] = await dbh.execute('DELETE FROM `training_kpk` WHERE teacher_id = ?',
         [teacher_id])


         const [result4, fields4] = await dbh.execute('DELETE FROM `discipline_middleware` WHERE teacher_id = ?',
         [teacher_id])

         for(let op = 0; op < name_table_project .length; op++ ) {
            console.log(name_table_project[op])
            let [result5, fields5] =  await dbh.execute('DELETE FROM `'+ name_table_project[op] +'` WHERE teacher_id = ? ',
            [teacher_id])
         }

         dbh.end()
         return result;
      }   
      
   }catch(e) {
      console.log(e.message)
   }
}

/** END BLOCK ----------------------------------------  */

/** ОБНОВИТЬ СТАТУС ШКОЛЫ */

exports.changeStatusSchool = async(req , res) => {
   try{
      const dbh = await mysql.createConnection({
         host: process.env.DATABASE_HOST,
         user: process.env.DATABASE_USER,
         database: process.env.DATABASE,
         password: process.env.DATABASE_PASSWORD,
      })

      const {id_school, project_id, current_status} = await req;

      //TODO менять статус по ID проекта

      const [result, fields] = await dbh.execute(`UPDATE users SET status = ? WHERE school_id = ? `, [current_status, id_school])


      dbh.end()
      return result;


   }catch(e) {
      console.log(e.message)
   }
}

/** END BLOCK ----------------------------------------  */



/** DELETE SCHOOL FROM CURRENT PROJECT */

exports.deleteSchoolFromCurrentProject = async(req , res) => {
   try{
      const dbh = await mysql.createConnection({
         host: process.env.DATABASE_HOST,
         
         user: process.env.DATABASE_USER,
         database: process.env.DATABASE,
         password: process.env.DATABASE_PASSWORD,
         
      })

      const id_project = await req.id;
      const is_school = await req.id_school;

      const [result, fields] = 
         await dbh.execute('DELETE FROM `middleware_project_school` WHERE school_id = ? AND project_id = ?',
         [is_school, id_project])

         dbh.end()
         return result;
      
   }catch(e) {
      console.log(e.message)
   }
}

/** END BLOCK ----------------------------------------  */
 