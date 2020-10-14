const mysql = require('mysql2/promise')
const bcrypt = require('bcryptjs')
const { v4: uuidv4 } = require('uuid'); 

/**
 * ######################  SELECT ROWS IN SQL #################################
 * ############################################################################
 */

/** GET  CARD BY TEACHER ID  */

exports.getCardByTeacherId = async function (req, res) {
   try{
      const dbh = await mysql.createConnection({
         host: process.env.DATABASE_HOST,
         port: process.env.DATABASE_PORT,
         user: process.env.DATABASE_USER,
         database: process.env.DATABASE,
         password: process.env.DATABASE_PASSWORD,
         socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock'
      })

      const teacher_id = await req.id_teacher;
      
      const [res, fields] = await dbh.execute('SELECT cftm.teacher_id, cftm.discipline_id, cftm.school_id, cftm.thema, '+
      ' cftm.source_id, cftm.class_id, cftm.k_1_1, cftm.k_1_2, cftm.k_1_3, cftm.k_2_1, cftm.k_2_2, cftm.k_3_1, cftm.k_4_1,'+
      ' cftm.k_5_1, cftm.k_5_2, cftm.k_6_1,  EXTRACT(DAY FROM cftm.create_mark_date) as day, '+
      ' EXTRACT(MONTH FROM cftm.create_mark_date) as month, EXTRACT(YEAR FROM cftm.create_mark_date) as year,dt.title_discipline,'+
      ' outside.source_fio, outside.position_name, outside.source_workplace, stbl.name_source  '+
      ' FROM card_from_project_teacher_mark as cftm'+
      ' INNER JOIN  discipline_title as dt ON cftm.discipline_id = dt.id_discipline '+
      ' INNER JOIN  outside_card as outside ON cftm.id_card = outside.card_id '+
      ' INNER JOIN  source_tbl as stbl ON cftm.source_id = stbl.id_source '+
      ' WHERE cftm.teacher_id = ?',[teacher_id])

      dbh.end()
      return res;
   }catch(e) {
      console.log(e.message)
   }
}

/** END BLOCK ----------------------------------------  */



/** GET  CARD BY TEACHER ID AND WITH FILTERS (DISCIPINE, SOURCE)  */

exports.getCardByTeacherIdWhithFilter = async function (req, res) {
    try{
       const dbh = await mysql.createConnection({
          host: process.env.DATABASE_HOST,
          port: process.env.DATABASE_PORT,
          user: process.env.DATABASE_USER,
          database: process.env.DATABASE,
          password: process.env.DATABASE_PASSWORD,
          socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock'
       })
 
       let teacher_id = await req.id_teacher;
       let source = await req['card-results-sourse'];
       let disc = await req['card-results-discipline'];
       console.log(source)
    //    console.log('////////')
    //    console.log(disc)

       if(source == 'all' && disc == 'all') {
            let [res, fields] = await dbh.execute('SELECT cftm.teacher_id, cftm.discipline_id, cftm.school_id, cftm.thema, cftm.source_id, cftm.class_id, cftm.k_1_1, cftm.k_1_2, cftm.k_1_3, cftm.k_2_1, cftm.k_2_2, cftm.k_3_1, cftm.k_4_1, cftm.k_5_1, cftm.k_5_2, cftm.k_6_1,  EXTRACT(DAY FROM cftm.create_mark_date) as day, EXTRACT(MONTH FROM cftm.create_mark_date) as month, EXTRACT(YEAR FROM cftm.create_mark_date) as year,dt.title_discipline, outside.source_fio, outside.position_name, outside.source_workplace FROM card_from_project_teacher_mark as cftm'+
            ' INNER JOIN  discipline_title as dt ON cftm.discipline_id = dt.id_discipline '+
            ' INNER JOIN  outside_card as outside ON cftm.id_card = outside.card_id '+
            ' WHERE cftm.teacher_id = ? ',[teacher_id])
            dbh.end()
            res.source = source;
            res.disc = disc
            return res;
       }else if(source == 'all'){
            let [res, fields] = await dbh.execute('SELECT cftm.teacher_id, cftm.discipline_id, cftm.school_id, cftm.thema, cftm.source_id, cftm.class_id, cftm.k_1_1, cftm.k_1_2, cftm.k_1_3, cftm.k_2_1, cftm.k_2_2, cftm.k_3_1, cftm.k_4_1, cftm.k_5_1, cftm.k_5_2, cftm.k_6_1,  EXTRACT(DAY FROM cftm.create_mark_date) as day, EXTRACT(MONTH FROM cftm.create_mark_date) as month, EXTRACT(YEAR FROM cftm.create_mark_date) as year,dt.title_discipline, outside.source_fio, outside.position_name, outside.source_workplace FROM card_from_project_teacher_mark as cftm'+
            ' INNER JOIN  discipline_title as dt ON cftm.discipline_id = dt.id_discipline '+
            ' INNER JOIN  outside_card as outside ON cftm.id_card = outside.card_id '+
            ' WHERE cftm.teacher_id = ? AND cftm.discipline_id = ?',[teacher_id, disc ])
            dbh.end()
            res.source = source;
            res.disc = disc
            return res;
       }else if(disc == 'all') {
            let [res, fields] = await dbh.execute('SELECT cftm.teacher_id, cftm.discipline_id, cftm.school_id, cftm.thema, cftm.source_id, cftm.class_id, cftm.k_1_1, cftm.k_1_2, cftm.k_1_3, cftm.k_2_1, cftm.k_2_2, cftm.k_3_1, cftm.k_4_1, cftm.k_5_1, cftm.k_5_2, cftm.k_6_1,  EXTRACT(DAY FROM cftm.create_mark_date) as day, EXTRACT(MONTH FROM cftm.create_mark_date) as month, EXTRACT(YEAR FROM cftm.create_mark_date) as year,dt.title_discipline, outside.source_fio, outside.position_name, outside.source_workplace FROM card_from_project_teacher_mark as cftm'+
            ' INNER JOIN  discipline_title as dt ON cftm.discipline_id = dt.id_discipline '+
            ' INNER JOIN  outside_card as outside ON cftm.id_card = outside.card_id '+
            ' WHERE cftm.teacher_id = ? AND  cftm.source_id = ?',[teacher_id, source ])
            dbh.end()
            res.source = source;
            res.disc = disc
            return res;
       }else {
            let [res, fields] = await dbh.execute('SELECT cftm.teacher_id, cftm.discipline_id, cftm.school_id, cftm.thema, cftm.source_id, cftm.class_id, cftm.k_1_1, cftm.k_1_2, cftm.k_1_3, cftm.k_2_1, cftm.k_2_2, cftm.k_3_1, cftm.k_4_1, cftm.k_5_1, cftm.k_5_2, cftm.k_6_1,  EXTRACT(DAY FROM cftm.create_mark_date) as day, EXTRACT(MONTH FROM cftm.create_mark_date) as month, EXTRACT(YEAR FROM cftm.create_mark_date) as year,dt.title_discipline, outside.source_fio, outside.position_name, outside.source_workplace FROM card_from_project_teacher_mark as cftm'+
            ' INNER JOIN  discipline_title as dt ON cftm.discipline_id = dt.id_discipline '+
            ' INNER JOIN  outside_card as outside ON cftm.id_card = outside.card_id '+
            ' WHERE cftm.teacher_id = ? AND  cftm.source_id = ? AND cftm.discipline_id = ?',[teacher_id, source, disc ])
            dbh.end()
            res.source = source;
            res.disc = disc
            return res;
       }
       
    }catch(e) {
       console.log(e.message)
    }
 }
 
 /** END BLOCK ----------------------------------------  */



/** GET PROFILE INFORMATION TEACHER BY ID */

exports.getAllInformationByTeacherId = async (req, res) => {
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
       const teacher_id = await req.id_teacher;
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



/** GET  DISCIPLINE LIST BY TEACHER ID  */

exports.disciplineListByTeacherId = async function (req, res) {
    try{
       const dbh = await mysql.createConnection({
          host: process.env.DATABASE_HOST,
          port: process.env.DATABASE_PORT,
          user: process.env.DATABASE_USER,
          database: process.env.DATABASE,
          password: process.env.DATABASE_PASSWORD,
          socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock'
       })
 
       const teacher_id = await req.id_teacher;
    //    console.log(teacher_id)
 
   // const [res, fields] = await dbh.execute("SELECT  * FROM `discipline_middleware` as dm INNER JOIN `area` ON schools.area_id = area.id_area WHERE id_school = ?",[teacher_id])
      const [res, fields] = await dbh.execute("SELECT  discipline_middleware.discipline_id, discipline_title.title_discipline FROM `discipline_middleware` INNER JOIN discipline_title ON discipline_middleware.discipline_id = discipline_title.id_discipline WHERE discipline_middleware.teacher_id = ?",[teacher_id])
 
       dbh.end()
       return res;
    }catch(e) {
       console.log(e.message)
    }
 }
 
 /** END BLOCK ----------------------------------------  */



 /** GET  SOURCE LIST BY TEACHER ID  */

exports. getUseSourceByTeacherId = async function (req, res) {
   try{
      const dbh = await mysql.createConnection({
         host: process.env.DATABASE_HOST,
         port: process.env.DATABASE_PORT,
         user: process.env.DATABASE_USER,
         database: process.env.DATABASE,
         password: process.env.DATABASE_PASSWORD,
         socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock'
      })

      const teacher_id = await req.id_teacher;

      
      const [res, fields] = await dbh.execute("SELECT  discipline_middleware.discipline_id, discipline_title.title_discipline FROM `discipline_middleware` INNER JOIN discipline_title ON discipline_middleware.discipline_id = discipline_title.id_discipline WHERE discipline_middleware.teacher_id = ?",[teacher_id])

      dbh.end()
      return res;
   }catch(e) {
      console.log(e.message)
   }
}

/** END BLOCK ----------------------------------------  */





 /**
 * ######################  INSERT IN SQL #################################
 * ############################################################################
 */

/** CREATE NEW MARK IN TEACHERS'S CARD BY TEACHER ID  */

exports.createNewMarkInCard = async (req, res) => {
    try {
       const dbh = await mysql.createConnection({
          host: process.env.DATABASE_HOST,
          port: process.env.DATABASE_PORT,
          user: process.env.DATABASE_USER,
          database: process.env.DATABASE,
          password: process.env.DATABASE_PASSWORD,
          socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock'
       })
 
       let {
        discipline_id,
        class_id,
        source_id,
        source_fio,
        position_name,
        source_workplace,
        thema,
        k_1_1,
        k_1_2,
        k_1_3,
        k_2_1,
        k_2_2,
        k_3_1,
        k_4_1,
        k_5_1,
        k_5_2,
        k_6_1,
        id_teacher,
        school_id,
        } = await req;
        
        console.log(req)

       const [result, fields] = await dbh.execute('INSERT INTO card_from_project_teacher_mark '+
       '(teacher_id, discipline_id, source_id, school_id, thema, class_id, k_1_1, k_1_2, '+
       'k_1_3, k_2_1, k_2_2, k_3_1, k_4_1, k_5_1, k_5_2, k_6_1 '+
        ') VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
        [id_teacher, discipline_id, source_id, school_id, thema, class_id, k_1_1, k_1_2,
        k_1_3, k_2_1, k_2_2, k_3_1, k_4_1, k_5_1, k_5_2, k_6_1])
        if(!result) {
            throw new Error('не удалось добавить оценку, обратитесь к технической службе')
        }else {
            if(source_id == 2) {
                const [result2, fields2] = await dbh.execute('INSERT INTO outside_card (card_id, source_fio, position_name, source_workplace, source_id)'+
                ' VALUES (?,?,?,?,?)',[result.insertId,source_fio, position_name, source_workplace, source_id])
            }else  {

                const [result3, fields3] = await dbh.execute('INSERT INTO outside_card (card_id, source_fio, position_name, source_workplace, source_id)'+
                ' VALUES (?,?,?,?,?)',[result.insertId,'Школа', 'Школа', 'Школа', source_id])
            }
        }
    
       dbh.end()
       return result.insertId;
    }catch(e) {
       console.log(e.message)
    }
 }
 
 /** END BLOCK ----------------------------------------  */



