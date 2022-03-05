const Card = require('../../models/admin/Card')
const Cabinet = require('../../models/admin/Cabinet')
const {validationResult} = require('express-validator')
const error_base = require('../../helpers/error_msg');
const notice_base = require('../../helpers/notice_msg')
const { v4: uuidv4 } = require('uuid');
const Account = require('../../models/admin/Account')



/** GET CARD PAGE BY TEACHER ID */

exports.getCardPageByTeacherId = async (req, res) => {
    try{
        if(req.params.id_project == 2) {
            const dataparams = await req.params;
            const card = await Card.getCardByTeacherId(dataparams)
            const disciplineListByTeacherId = await Card.disciplineListByTeacherId(dataparams)
            const teacher_id = await req.params.id_teacher;
            const school_id = await req.params.id_school;
            const project_id = await req.params.id_project;
            const teacherData = await Card.getAllInformationByTeacherId(dataparams)
            // console.log(req.session.user)
            console.log(disciplineListByTeacherId)
    
            return res.render('admin_teacher_card', {
                layout: 'admin',
                title: 'Личная карта учителя',
                teacherData,
                card,
                teacher_id,
                school_id,
                project_id,
                disciplineListByTeacherId,
                error: req.flash('error'),
                notice: req.flash('notice')
            })
        }else if(req.params.id_project == 3) {
            console.log('Данный раздел находится в разработке')
            return res.render('admin_page_not_ready', {
                layout: 'admin',
                title: 'Предупрехждение',
                error: req.flash('error'),
                notice: req.flash('notice')
            })
            
        }else {
            console.log('Ошибка в выборе проекта')
            console.log(req.params)
        }
        

    }catch (e) {
        console.log(e)
    }
}

/** END BLOCK */



/** GET CARD PAGE BY TEACHER ID */

exports.addMarkForTeacher = async (req, res) => {
    try{
        const dataparams = await req.params;
        const disciplineListByTeacherId = await Card.disciplineListByTeacherId(dataparams)
        const teacher_id = await req.params.id_teacher;
        const school_id = await req.params.id_school;
        const project_id = await req.params.id_project;
        const teacherData = await Card.getAllInformationByTeacherId(dataparams)

        console.log('sdsdsd')
        return  res.render('admin_teacher_card_add_mark', {
                layout: 'admin',
                title: 'Личная карта учителя',
                teacherData,
                teacher_id,
                school_id,
                project_id,
                disciplineListByTeacherId,
                error: req.flash('error'),
                notice: req.flash('notice')
            })

    }catch (e) {
        console.log(e)
    }
}

/** END BLOCK */



/** GET CARD PAGE BY TEACHER ID */

exports.getCardPageByTeacherIdWithFilter = async (req, res) => {
    try{
        const dataparams = await req.body; 
        const card = await Card.getCardByTeacherIdWhithFilter(req.body)
        const currentSourceId = await card.source;
        const currentDisc = await card.disc;
        const disciplineListByTeacherId = await Card.disciplineListByTeacherId(dataparams)
        const teacher_id = await req.params.id_teacher;
        const school_id  = await req.params.id_school;
        const project_id = await req.params.id_project;

        console.log('sdsdsd')
        
        const teacherData = await Card.getAllInformationByTeacherId(dataparams)

        return  res.render('admin_teacher_card', {
                layout: 'admin',
                title: 'Личная карта учителя',
                teacherData,
                card,
                teacher_id,
                school_id,
                project_id,
                disciplineListByTeacherId,
                currentSourceId,
                currentDisc,
                error: req.flash('error'),
                notice: req.flash('notice')
            })

    }catch (e) {
        console.log(e)
    }
}

/** END BLOCK */




exports.addHandleMarkForTeacher = async (req, res) => {
    try {
        let lastId = await Card.createNewMarkInCard(req.body); 
      if(lastId) {
        req.flash('notice', notice_base.success_insert_sql );
        return res.status(200).redirect('/admin/cards/school/'+req.body.school_id+'/teacher/'+req.body.id_teacher+'/project/'+req.body.project_id);
    }else {
        req.flash('errors', error_base.wrong_sql_insert)
    }   return res.status(422).redirect('/admin/cards/add/school/'+req.body.school_id+'/teacher/'+req.body.id_teacher+'/project/'+req.body.project_id)
    
    }catch (e) {
        console.log(e)
    }
}

