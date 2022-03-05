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
    
          user: process.env.DATABASE_USER,
          database: process.env.DATABASE,
          password: process.env.DATABASE_PASSWORD,
          
       })
 
       const teacher_id = await req.teacher_id;
       
       const [res, fields] = await dbh.execute('SELECT cftm.id_card, cftm.teacher_id, cftm.discipline_id, cftm.school_id, cftm.thema, '+
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



/** GET  SINGLE CARD BY ID  */

 exports.getSingleCard = async function (req, res) {
   try{
      const dbh = await mysql.createConnection({
         host: process.env.DATABASE_HOST,
   
         user: process.env.DATABASE_USER,
         database: process.env.DATABASE,
         password: process.env.DATABASE_PASSWORD,
         
      })

      const id_card = await req.id_card;
      
      const [res, fields] = await dbh.execute('SELECT cftm.id_card, cftm.teacher_id, cftm.discipline_id, cftm.school_id, cftm.thema, '+
      ' cftm.source_id, cftm.class_id,cftm.liter_class, cftm.k_1_1, cftm.k_1_2, cftm.k_1_3, cftm.k_2_1, cftm.k_2_2, cftm.k_3_1, cftm.k_4_1,'+
      ' cftm.k_5_1, cftm.k_5_2, cftm.k_6_1,  EXTRACT(DAY FROM cftm.create_mark_date) as day, '+
      ' EXTRACT(MONTH FROM cftm.create_mark_date) as month, EXTRACT(YEAR FROM cftm.create_mark_date) as year, cftm.create_mark_date, dt.title_discipline,'+
      ' outside.source_fio, outside.position_name, outside.source_workplace, stbl.name_source  '+
      ' FROM card_from_project_teacher_mark as cftm'+
      ' INNER JOIN  discipline_title as dt ON cftm.discipline_id = dt.id_discipline '+
      ' INNER JOIN  outside_card as outside ON cftm.id_card = outside.card_id '+
      ' INNER JOIN  source_tbl as stbl ON cftm.source_id = stbl.id_source '+
      ' WHERE cftm.id_card = ?',[id_card])

      dbh.end()
      return res;
   }catch(e) {
      console.log(e.message)
   }
}

/** END BLOCK ----------------------------------------  */




/** GET  ALL CARDS BY  TEACHER ID  */

exports.getAllMarksByTeacherId = async function (req, res) {
   try{
      const dbh = await mysql.createConnection({
         host: process.env.DATABASE_HOST,
         user: process.env.DATABASE_USER,
         database: process.env.DATABASE,
         password: process.env.DATABASE_PASSWORD,
      })

      const teacher_id = await req.teacher_id;
      
      const [res, fields] = await dbh.execute('SELECT cftm.id_card, cftm.teacher_id, cftm.discipline_id, cftm.school_id, cftm.thema, '+
      ' cftm.source_id, cftm.class_id, cftm.k_1_1, cftm.k_1_2, cftm.k_1_3, cftm.k_2_1, cftm.k_2_2, cftm.k_3_1, cftm.k_4_1,'+
      ' cftm.k_5_1, cftm.k_5_2, cftm.k_6_1,  EXTRACT(DAY FROM cftm.create_mark_date) as day, '+
      ' EXTRACT(MONTH FROM cftm.create_mark_date) as month, EXTRACT(YEAR FROM cftm.create_mark_date) as year, cftm.create_mark_date, dt.title_discipline,'+
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


/** GET  RECOMMENDATION  */

exports.getRecommendation = async function (req, res) {
   try{
      const dbh = await mysql.createConnection({
         host: process.env.DATABASE_HOST,
         user: process.env.DATABASE_USER,
         database: process.env.DATABASE,
         password: process.env.DATABASE_PASSWORD,
      })

      const v_param = await req.v_param;
      const k_param = await req.k_param;

      const [res, fields] = await dbh.execute('SELECT * FROM recommendation WHERE k_id = ? AND val = ?',[k_param, v_param])

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
   
         user: process.env.DATABASE_USER,
         database: process.env.DATABASE,
         password: process.env.DATABASE_PASSWORD,
         
      })

      let {
       discipline_id,
       class_id,
       liter_class = '',
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
       
      const [result, fields] = await dbh.execute('INSERT INTO card_from_project_teacher_mark '+
      '(teacher_id, discipline_id, source_id, school_id, thema, class_id,liter_class, k_1_1, k_1_2, '+
      'k_1_3, k_2_1, k_2_2, k_3_1, k_4_1, k_5_1, k_5_2, k_6_1 '+
       ') VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
       [id_teacher, discipline_id, source_id, school_id, thema, class_id,liter_class, k_1_1, k_1_2,
       k_1_3, k_2_1, k_2_2, k_3_1, k_4_1, k_5_1, k_5_2, k_6_1])
       if(!result) {
           throw new Error('не удалось добавить оценку, обратитесь к технической службе')
       }else {
           if(source_id == 1) {
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



/** GET  CARD BY TEACHER ID AND WITH FILTERS (DISCIPINE, SOURCE)  */

exports.getCardByTeacherIdWhithFilter = async function (req, res) {
   try{
      const dbh = await mysql.createConnection({
         host: process.env.DATABASE_HOST,
   
         user: process.env.DATABASE_USER,
         database: process.env.DATABASE,
         password: process.env.DATABASE_PASSWORD,
         
      })

      let teacher_id = await req.id_teacher;
      let source = await req['card-results-sourse'];
      let disc = await req['card-results-discipline'];
      //console.log(source)
   //    console.log('////////')
   //    console.log(disc)

      if(source == 'all' && disc == 'all') {
           let [res, fields] = await dbh.execute('SELECT cftm.id_card, cftm.teacher_id, cftm.discipline_id, cftm.school_id, cftm.thema,'+
           ' cftm.source_id, cftm.class_id, cftm.k_1_1, cftm.k_1_2, cftm.k_1_3, cftm.k_2_1, cftm.k_2_2, cftm.k_3_1, '+
           ' cftm.k_4_1, cftm.k_5_1, cftm.k_5_2, cftm.k_6_1,  EXTRACT(DAY FROM cftm.create_mark_date) as day, '+
           ' EXTRACT(MONTH FROM cftm.create_mark_date) as month, EXTRACT(YEAR FROM cftm.create_mark_date) as year, '+
           ' dt.title_discipline, outside.source_fio, outside.position_name, outside.source_workplace FROM '+
           ' card_from_project_teacher_mark as cftm'+
           ' INNER JOIN  discipline_title as dt ON cftm.discipline_id = dt.id_discipline '+
           ' INNER JOIN  outside_card as outside ON cftm.id_card = outside.card_id '+
           ' WHERE cftm.teacher_id = ? ',[teacher_id])
           dbh.end()
           res.source = source;
           res.disc = disc
           return res;
      }else if(source == 'all'){
           let [res, fields] = await dbh.execute('SELECT cftm.id_card, cftm.teacher_id, cftm.discipline_id, cftm.school_id, cftm.thema, cftm.source_id, cftm.class_id, cftm.k_1_1, cftm.k_1_2, cftm.k_1_3, cftm.k_2_1, cftm.k_2_2, cftm.k_3_1, cftm.k_4_1, cftm.k_5_1, cftm.k_5_2, cftm.k_6_1,  EXTRACT(DAY FROM cftm.create_mark_date) as day, EXTRACT(MONTH FROM cftm.create_mark_date) as month, EXTRACT(YEAR FROM cftm.create_mark_date) as year,dt.title_discipline, outside.source_fio, outside.position_name, outside.source_workplace FROM card_from_project_teacher_mark as cftm'+
           ' INNER JOIN  discipline_title as dt ON cftm.discipline_id = dt.id_discipline '+
           ' INNER JOIN  outside_card as outside ON cftm.id_card = outside.card_id '+
           ' WHERE cftm.teacher_id = ? AND cftm.discipline_id = ?',[teacher_id, disc ])
           dbh.end()
           res.source = source;
           res.disc = disc
           return res;
      }else if(disc == 'all') {
           let [res, fields] = await dbh.execute('SELECT cftm.id_card, cftm.teacher_id, cftm.discipline_id, cftm.school_id, cftm.thema, cftm.source_id, cftm.class_id, cftm.k_1_1, cftm.k_1_2, cftm.k_1_3, cftm.k_2_1, cftm.k_2_2, cftm.k_3_1, cftm.k_4_1, cftm.k_5_1, cftm.k_5_2, cftm.k_6_1,  EXTRACT(DAY FROM cftm.create_mark_date) as day, EXTRACT(MONTH FROM cftm.create_mark_date) as month, EXTRACT(YEAR FROM cftm.create_mark_date) as year,dt.title_discipline, outside.source_fio, outside.position_name, outside.source_workplace FROM card_from_project_teacher_mark as cftm'+
           ' INNER JOIN  discipline_title as dt ON cftm.discipline_id = dt.id_discipline '+
           ' INNER JOIN  outside_card as outside ON cftm.id_card = outside.card_id '+
           ' WHERE cftm.teacher_id = ? AND  cftm.source_id = ?',[teacher_id, source ])
           dbh.end()
           res.source = source;
           res.disc = disc
           return res;
      }else {
           let [res, fields] = await dbh.execute('SELECT cftm.id_card, cftm.teacher_id, cftm.discipline_id, cftm.school_id, cftm.thema, '+
           ' cftm.source_id, cftm.class_id, cftm.k_1_1, cftm.k_1_2, cftm.k_1_3, cftm.k_2_1, cftm.k_2_2, cftm.k_3_1, cftm.k_4_1, '+
           ' cftm.k_5_1, cftm.k_5_2, cftm.k_6_1,  EXTRACT(DAY FROM cftm.create_mark_date) as day, '+
           ' EXTRACT(MONTH FROM cftm.create_mark_date) as month, EXTRACT(YEAR FROM cftm.create_mark_date) '+
           ' as year,dt.title_discipline, outside.source_fio, outside.position_name, outside.source_workplace FROM '+
           ' card_from_project_teacher_mark as cftm'+
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

exports.deleteMarkInCard = async(req , res) => {

    try{
        const dbh = await mysql.createConnection({
            host: process.env.DATABASE_HOST,
            user: process.env.DATABASE_USER,
            database: process.env.DATABASE,
            password: process.env.DATABASE_PASSWORD,

        })

        const school_id = await req.session['school_id']
        if(school_id) {

        const {id_card} = await req

        const [deleteCard, fields] = await dbh.execute('DELETE FROM card_from_project_teacher_mark WHERE id_card = ?  AND school_id = ?', [id_card,school_id])
        const [deleteCardFromOutside, fields2] = await dbh.execute('DELETE FROM outside_card WHERE card_id = ? ', [id_card])

            dbh.end()
            return deleteCard;
        }


    }catch(e) {
        console.log(e.message)
    }
}

