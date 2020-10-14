const cabinet = require('../../models/admin/Cabinet')
const {validationResult} = require('express-validator')
const notice_base = require('../../helpers/notice_msg')
const { v4: uuidv4 } = require('uuid');



/** GENERATION FORM FOR EDIT MAIN INFORMATION ABOUT TEACHER */

exports.getFormForEditTeacher = async (req, res) => {
    try{
        const data = await cabinet.getProfileByTeacherId(req.params)
        // const birthdayConverter = data[0].birthday.toJSON().slice(0, 10)
        let d = data[0].birthday.getDate();
        if (d < 10) d = '0' + d;
        let m = data[0].birthday.getMonth() + 1;
        if (m < 10) m = '0' + m;
        const y = data[0].birthday.getFullYear();
        const birthdayConverter = `${y}-${m}-${d}`;
        const gender = await cabinet.getGenders()
        const edu = await cabinet.getLevelEdu()
        const category = await cabinet.getCategories()
        const school_id = await req.params.school_id
        const teacher_id = data[0].id_teacher


        const position = await cabinet.getPositionList()
       
        return res.render('admin_edit_teacher', {
            layout: 'admin',
            title: 'Редактировать',
            data,
            birthdayConverter,
            gender,
            edu,
            category,
            school_id,
            teacher_id,
            position,
            notice: req.flash('notice')
        })
    }catch(e) { 
        console.log(e.message)
    }
}

/** END CONTROLLER ---------------------------------------------- */




/** UPDATE TEACHER MAIN INFORMATION BY ID (POST HANDLER) */

exports.updateTeacherMainInformationById = async (req, res) => {
    try{
        const school_id = await req.body.school_id
        const result  = await cabinet.updateTeacherMainInformationById(req.body)
        if(result) {
            const id_teacher = await req.body.id_teacher;
        req.flash('notice', notice_base.success_update_sql);
        return res.status(200).redirect(`/admin/school_list/${school_id}/${id_teacher}`)
        }else {
            throw new Error('Произошла ошибка при обновлении!')
        }
        
    }catch(e) { 
        console.log(e.message)
    }
}

/** END CONTROLLER ---------------------------------------------- */



/** DELETE TEACHER PROFILE  FROM NEXT TABLES
 * (TEACHERS, TRAINING_KPK, TABLE_MEMBERS, DISCIPLINE_MIDDLEWARE)
 *  */

 exports.deleteTeacherProfileById = async (req, res) => {
     try{
        const school_id = await req.params.school_id
        const result = cabinet.deleteTeacherProfileById(req.params)
        if(result) {
            req.flash('notice', notice_base.success_delete_rows);
            return res.status(200).redirect(`/admin/school_list/${school_id}/`)
        }else {
            throw new Error('Произошла ошибка при обновлении!')
        }
     }catch(e) {
        console.log(e.message)
     }
    
 }

 /** END CONTROLLER ---------------------------------------------- */



