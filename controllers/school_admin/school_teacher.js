const SchoolProject = require('../../models/school_admin/SchoolProject')
const SchoolCabinet = require('../../models/school_admin/SchoolCabinet')
const SchoolTeacher = require('../../models/school_admin/SchoolTeacher')
const {validationResult} = require('express-validator')
const error_base = require('../../helpers/error_msg');
const notice_base = require('../../helpers/notice_msg')
const { v4: uuidv4 } = require('uuid');



/** GET  PROJECTS LIST */

exports.getProfileByTeacherId = async (req, res) => {

    try{
        
        if(req.session.user) {

            const teacher = await SchoolTeacher.getProfileByTeacherId(req.params)

            if(!teacher.length) {
                return res.status(422).redirect('/school/cabinet');
            }

            const school = await SchoolCabinet.getSchoolData(req.session.user);
            const school_id = await school[0].id_school;
            const teacher_id = await req.params.teacher_id;
            const kpk = await SchoolTeacher.getAllKpkByIdTeacher(req.params)
            const projectsI = await SchoolTeacher.getInformationAboutIssetTeacherInProject(req.params)
            let issetInProjects = []

            for(let i =  0; i < projectsI.length; i++) {
                if(projectsI[i].project_id > 1) {
                    issetInProjects.push(projectsI[i])
                }
            }
         
            const d =  teacher[0].birthday.getDate();
            const m =  teacher[0].birthday.getMonth();
            const month = ['января', 'февраля','марта', 'апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'];
            const y =  teacher[0].birthday.getFullYear();
            const birthdayShort = `${d}  ${month[m]} ${y}`;


            const support_type = await SchoolCabinet.getSupportType()
            const school_name = await school[0].school_name;
            const title_area = await school[0].title_area;
    
            return res.render('school_teacher_profile', {
                layout: 'mainprofile',
                title: 'Профиль учителя',
                school_id,
                teacher_id,
                teacher,
                birthdayShort,
                school_name,
                kpk,
                title_area,
                issetInProjects,
                support_type,
                error: req.flash('error'),
                notice: req.flash('notice')
            })
    
          }else {
            req.session.isAuthenticated = false
            req.session.destroy( err => {
                if (err) {
                    throw err
                }else {
                    res.redirect('/auth')
                } 
            })
          }
        
    }catch(e) { 
        console.log(e.message)
    }
}

/** END BLOCK */



/** GET TEACHERS FROM CURRENT SCHOOL  */

exports.getSchoolTeachers = async (req, res) => {

    try{
        
        if(req.session.user) {

            const projects = await SchoolProject.getAllProjectsWithThisSchool(req.session.user)
            const gender = await SchoolTeacher.getGenders()
            const level_edu = await SchoolTeacher.getLevelEdu()
            const positionList = await SchoolTeacher.getPositionList()
            const disciplines = await SchoolTeacher.getdisciplinesList()
            const categories = await SchoolTeacher.getCategories()
            const teachers = await SchoolTeacher.getAllTeachersFromThisSchool(req.session.user)

            const school = await SchoolCabinet.getSchoolData(req.session.user);
            const school_id = await school[0].id_school;
            const support_type = await SchoolCabinet.getSupportType()
            const school_name = await school[0].school_name;
            const title_area = await school[0].title_area;
            const email = await req.session.user.email;
            
            if(req.body.surname && req.body._csrf) {
                const id_teacher = uuidv4()
                const surname = await req.body.surname.trim();
                const firstname = await req.body.firstname.trim();
                const patronymic = await req.body.patronymic.trim();
                const birthday = await req.body.birthday;
                const snils = await parseInt(req.body.snils);
                const gender_id = await parseInt(req.body.gender);
                const specialty = await req.body.specialty.trim();
                const level_of_education_id = await parseInt(req.body.level_of_education) || 1;
                const diploma = await req.body.diploma.trim();
                const position = await parseInt(req.body.position);
                const total_experience = await parseInt(req.body.total_experience);
                const teaching_experience = await parseInt(req.body.teaching_experience);
                const category = await parseInt(req.body.category) || 1;
                const phone = await req.body.phone.trim();
                const email = await req.body.email.trim();
                const disciplines = await req.body['disciplines[]'];
                const place_kpk = await req.body.place_kpk.trim();
                const year_kpk = await req.body.year.trim();
                const school_id = await req.body.id_school.trim();
                const project_id = await parseInt(req.body.project_id);
                
                const errors = validationResult(req)

                if(!errors.isEmpty()){
                    req.flash('error', errors.array()[0].msg);
                    return res.status(422).redirect('/school/list');
                }else {
                    const result = await SchoolTeacher.addNewTeacher({
                        id_teacher,
                        surname,
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
                        disciplines,
                        place_kpk,
                        year_kpk,
                        school_id,
                        project_id
                    })
                
                    if(result) {
                        req.flash('notice', notice_base.success_insert_sql );
                        return res.status(200).redirect('/school/list');
                    }
                }
            }
    
            return res.render('school_profile', {
                layout: 'mainprofile',
                title: 'Профиль учителя',
                school_id,
                school,
                email,
                gender,
                teachers,
                school_name,
                level_edu,
                positionList,
                title_area,
                disciplines,
                categories,
                projects,
                support_type,
                error: req.flash('error'),
                notice: req.flash('notice')
            })
    
          }else {
            req.session.isAuthenticated = false
            req.session.destroy( err => {
                if (err) {
                    throw err
                }else {
                    res.redirect('/auth')
                } 
            })
          }
        
    }catch(e) { 
        console.log(e.message)
    }
}

/** END BLOCK */


/** GENERATION FORM FOR EDIT MAIN INFORMATION ABOUT TEACHER */

exports.getTeacherByIdForEdit = async (req, res) => {
    try{
      
        if(req.session.user) {

            const teacher = await SchoolTeacher.getProfileByTeacherId(req.params)
            if(!teacher.length) {
                return res.status(422).redirect('/school/cabinet');
            }
            const gender = await SchoolTeacher.getGenders()
            const edu = await SchoolTeacher.getLevelEdu()
            const position = await SchoolTeacher.getPositionList()
            const category = await SchoolTeacher.getCategories()

            const school = await SchoolCabinet.getSchoolData(req.session.user);
            const school_id = await school[0].id_school;
            const teacher_id = await req.params.teacher_id;
            const kpk = await SchoolTeacher.getAllKpkByIdTeacher(req.params)
            const issetInProjects = await SchoolTeacher.getInformationAboutIssetTeacherInProject(req.params)
         
            let d = teacher[0].birthday.getDate();
            if (d < 10) d = '0' + d;
            let m = teacher[0].birthday.getMonth() + 1;
            if (m < 10) m = '0' + m;
            const y = teacher[0].birthday.getFullYear();
            const birthdayConverter = `${y}-${m}-${d}`;

            const support_type = await SchoolCabinet.getSupportType()
            const school_name = await school[0].school_name;


            if(req.body.school_id && req.body._csrf) {
                const result  = await SchoolTeacher.updateTeacherMainInformationById(req.body)
                if(result) {
                const id_teacher = await req.body.id_teacher;
                req.flash('notice', notice_base.success_update_sql);
                return res.status(200).redirect(`/school/list/${teacher_id}`)
                }else {
                    req.flash('error', error_base.error_update);
                    return res.status(200).redirect(`/school/list/${teacher_id}`)
                    
                }
            }
    
            return res.render('school_edit_teacher', {
                layout: 'mainprofile',
                title: 'Редактировать учителя',
                school_id,
                teacher_id,
                teacher,
                birthdayConverter,
                school_name,
                kpk,
                edu,
                gender,
                category,
                position,
                issetInProjects,
                error: req.flash('error'),
                notice: req.flash('notice')
            })
    
          }else {
            req.session.isAuthenticated = false
            req.session.destroy( err => {
                if (err) {
                    throw err
                }else {
                    res.redirect('/auth')
                } 
            })
          }
        
    }catch(e) { 
        console.log(e.message)
    }
}

/** END CONTROLLER ---------------------------------------------- */



/** GENERATION FORM FOR EDIT MAIN INFORMATION ABOUT TEACHER */

exports.avatar = async (req, res) => {
    try{
        if(req.session.user) {

            const teacher = await SchoolTeacher.getProfileByTeacherId(req.body)

            if(!teacher.length) {
                return res.status(422).redirect('/school/cabinet');
            }


            if(req.files) {
                let avatar = await req.files.file;

                avatar.teacher_id = await req.body.teacher_id;

                const libraryMIME = ['image/jpeg','image/gif','image/png'];

                function checkTypeImg(type){
                        return type == avatar.mimetype;
                }
                let fileFormat = libraryMIME.filter(checkTypeImg);

                if(!fileFormat){
                        req.flash('notice', notice_base.inccorect_type_mime);
                        return res.status(422).redirect('/school/cabinet');
                }

                let randomName;
                if(fileFormat[0] == libraryMIME[0]){
                    randomName =  uuidv4() + '.jpg';
                }else if(fileFormat[0] == libraryMIME[1]){
                    randomName =  uuidv4() + '.gif';
                }else if(fileFormat[0] == libraryMIME[2]){
                    randomName =  uuidv4() + '.png';
                }else {
                    throw new Error('Неизвестная ошибка при выборе фотографии профиля!')
                }

                avatar.name = randomName;

                console.log(avatar)
                
                avatar.mv('./public/img/teachers/uploads/avatars/' + avatar.name);

                const result  = await SchoolTeacher.updateTeacherAvatar(avatar)

                req.flash('notice', notice_base.success_insert_avatar);
                return res.redirect(`/school/list/${req.body.teacher_id}`)
            }
    
          }else {
            req.session.isAuthenticated = false
            req.session.destroy( err => {
                if (err) {
                    throw err
                }else {
                    res.redirect('/auth')
                } 
            })
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

       if(req.session.user) {
        const teacher = await SchoolTeacher.getProfileByTeacherId(req.params)
        if(!teacher.length) {
            return res.status(422).redirect('/school/cabinet');
        }
        const result = await SchoolTeacher.deleteTeacherProfileById({
            teacher_id: req.params.teacher_id,
            school_id: req.session.user.school_id 
        })
        if(result) {
            req.flash('notice', notice_base.success_delete_rows);
            return res.status(200).redirect(`/school/list/`)
        }else {
            throw new Error('Произошла ошибка при удалении!')
        }

      }else {
        req.session.isAuthenticated = false
        req.session.destroy( err => {
            if (err) {
                throw err
            }else {
                res.redirect('/auth')
            } 
        })
      }

    }catch(e) {
       console.log(e.message)
    }
   
}

/** END CONTROLLER ---------------------------------------------- */






