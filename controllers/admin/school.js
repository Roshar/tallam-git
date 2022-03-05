const cabinet = require('../../models/admin/Cabinet')
const Teacher = require('../../models/admin/Teacher')
const {validationResult} = require('express-validator')
const error_base = require('../../helpers/error_msg');
const notice_base = require('../../helpers/notice_msg')
const { v4: uuidv4 } = require('uuid');
const Account = require('../../models/admin/Account')



/** GENERATION FORM FOR ADD NEW SCHOOL */

exports.generationFormForAddNewSchool = async (req, res) => {
    try{

        const areas = await cabinet.getAllArea()

        const types = await cabinet.getTypes()
    
        return res.render('admin_add_new_school', {
            layout: 'admin',
            title: 'Добавить в базу ОУ',
            areas,
            types,
            error: req.flash('error'),
            notice: req.flash('notice')
        })

    }catch (e) {
        console.log(e)
    }
}

/** END BLOCK */



/** HANDLER  */

exports.handle = async (req, res) => {
    try {
        const fullname = await req.body.fullname.trim();
        const short_name = await req.body.short_name.trim();
        const area_id = await parseInt(req.body.area);
        const type_id = await parseInt(req.body.type);

    if (fullname < 5 || short_name < 5) {
        req.flash('error', error_base.incorrect_input );
        return res.status(422).redirect('/admin/add_new_school');

        if (!Number.isInteger(area_id) || !Number.isInteger(type_id)) {
            req.flash('error', error_base.incorrect_input );
            return res.status(422).redirect('/admin/add_new_school');
        }
        if ( area_id === 0 || type_id === 0 ) {
            req.flash('error', error_base.incorrect_input );
            return res.status(422).redirect('/admin/add_new_school');
        }
    }else {
        // console.log(fullname + short_name + area_id + type_id)
        const ress = await cabinet.addNewSchool({fullname,short_name,area_id,type_id})
        req.flash('notice', notice_base.success_insert_sql);
        return res.status(200).redirect('/admin/school_list')
        
    }
    }catch(e) {
        console.log(e.message)
    }
    
}

/** END BLOCK */



/** GET LIST WITH SCHOOLS */

exports.getMainListSchools = async(req, res) => {
    try{
        //LIMITED 10 ROWS LAST ADDED SCHOOLS
        const schools = await cabinet.getAllSchoolProfiles()
        const areas =  await cabinet.getAllArea()

        return res.render('admin_main_list_schools', {
            layout: 'admin',
            title: 'Список (база) ОУ ЧР',
            schools,
            areas,
            error: req.flash('error'),
            notice: req.flash('notice')
        })
    }catch(e) {
        console.log(e)
    }
    
}

/** END BLOCK */



/** GET SCHOOL PROFILE ONLY FROM CURRENT PROJECT */

exports.getSchoolProfileByIdWithFILTERcurrentProject = async(req, res) => {

    try{
        const id = await req.params;
        const project_id = await req.params.project_id;
        const school = await cabinet.getSchoolProfileById(id)
        const project = await cabinet.getInfoFromProjectById(project_id)
        const teachers = await Teacher.getAllTeachersFromThisSchoolFromCurrentProject(req.params)
        
        if(school) {
            return  res.render('admin_school_profile_in_current_project', {
                    layout: 'admin',
                    title: school[0].short_name,
                    school,
                    project_name: project[0].name_project,
                    schoolId: school[0].id_school,
                    project_id,
                    teachers,
                    error: req.flash('error'),
                    notice: req.flash('notice')
                })
        }
        
    }catch(e) {
        console.log(e.message)
    }
}

/** END BLOCK */



/** GET SCHOOL PROFILE  */

exports.getSchoolProfileById = async(req, res) => {

    try{
        const id = await req.params;
        const account = await Account.getAccountDataBySchoolId(id) || null
        const school = await cabinet.getSchoolProfileById(id)
        const projects = await cabinet.getAllProjectsWithThisSchool(id)
        const gender = await cabinet.getGenders()
        const level_edu = await cabinet.getLevelEdu()
        const positionList = await cabinet.getPositionList()
        const disciplines = await cabinet.getdisciplinesList()
        const categories = await cabinet.getCategories()
        const teachers = await cabinet.getAllTeachersFromThisSchool(id) 
        const school_id = id;

        if(school) {
            return  res.render('admin_school_profile', {
                    layout: 'admin',
                    title: school[0].school_name,
                    account,
                    school,
                    projects,
                    gender,
                    level_edu,
                    positionList,
                    disciplines,
                    categories,
                    teachers,
                    error: req.flash('error'),
                    notice: req.flash('notice')
                })
        }
        
    }catch(e) {
        console.log(e.message)
    }
}

/** END BLOCK */



/** CREATE NEW TEACHER IN SCHOOL   */

exports.insertNewTeacherInThisSchoolBase = async(req, res) => {
    console.log('ывыв')
    return true
    // try{
    //
    //     const id_teacher = uuidv4()
    //     const {surname,firstname,patronymic = '',birthday, snils = 'qsqs',
    //         gender_id, specialty = '',level_of_education_id,diploma = '',
    //         position, total_experience,teaching_experience, category, phone = '',email = '', disciplines,
    //         place_kpk = '', year_kpk = '', school_id, project_id } = await req.body
    //     req.body
    //     return true
    //     // const surname = await req.body.surname.trim();
    //     // const firstname = await req.body.firstname.trim();
    //     // const patronymic = await req.body.patronymic.trim();
    //     // const birthday = await req.body.birthday;
    //     // const snils = await req.body.snils;
    //     // const gender_id = await parseInt(req.body.gender);
    //     // const specialty = await req.body.specialty.trim();
    //     // const level_of_education_id = await parseInt(req.body.level_of_education);
    //     // const diploma = await req.body.diploma.trim();
    //     // const position = await parseInt(req.body.position);
    //     // const total_experience = await parseInt(req.body.total_experience);
    //     // const teaching_experience = await parseInt(req.body.teaching_experience);
    //     // const category = await parseInt(req.body.category);
    //     // const phone = await req.body.phone.trim();
    //     // const email = await req.body.email.trim();
    //     // const disciplines = await req.body['disciplines[]'];
    //     // const place_kpk = await req.body.place_kpk.trim();
    //     // const year_kpk = await req.body.year.trim();
    //     // const school_id = await req.body.id_school.trim();
    //     // const project_id = await parseInt(req.body.project_id);
    //
    //
    //     const errors = validationResult(req)
    //
    //
    //     if(!errors.isEmpty()){
    //
    //         req.flash('error', errors.array()[0].msg);
    //         return res.status(422).redirect('/admin/school_list/'+ school_id);
    //     }else {
    //         const result = await cabinet.addNewTeacher({
    //             id_teacher,
    //             surname,
    //             firstname,
    //             patronymic,
    //             birthday,
    //             snils,
    //             gender_id,
    //             specialty,
    //             level_of_education_id,
    //             diploma,
    //             position,
    //             total_experience,
    //             teaching_experience,
    //             category,
    //             phone,
    //             email,
    //             disciplines,
    //             place_kpk,
    //             year_kpk,
    //             school_id,
    //             project_id
    //         })
    //
    //         if(result) {
    //             req.flash('notice', notice_base.success_insert_sql );
    //             return res.status(200).redirect('/admin/school_list/'+ school_id);
    //         }
    //     }
    //
    // }catch(e) {
    //     console.log(e.message)
    // }
}

/** END BLOCK */




/** GET PROFILE TEACHER BY ID SCHOOL AND BY ID TEACHER */

exports.getProfileByTeacherIdInProject = async(req, res) => {

    try{
        /** @params : id_school and id_teacher */
        const school_id = await req.params.id;
        const teacher_id = await req.params.teacher_id
        params = await req.params;
        const school = await cabinet.getSchoolProfileById(params)
        const teacher = await cabinet.getProfileByTeacherId(params)
        const month = ['января', 'февраля','марта', 'апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'];
        const bdresult = await teacher[0].birthday.getDate()  + ' ' + month[teacher[0].birthday.getMonth()] + ' ' + teacher[0].birthday.getFullYear();
        const kpk = await cabinet.getAllKpkByIdTeacher(params)
        const discipline = await cabinet.getTeacherDisciplines(params)
        const project_id = await req.params.project_id

            
        return res.render('admin_teacher_profile_in_project', {
                layout: 'admin',
                title: 'Общая информация об учителе',
                school,
                school_id,
                teacher,
                bdresult,
                kpk,
                discipline,
                teacher_id,
                project_id,
                notice: req.flash('notice')
            })

    }catch(e) {
        console.log(e.message)
    }
}
/** END BLOCK */



/** GET PROFILE TEACHER BY ID SCHOOL AND BY ID TEACHER */

exports.getProfileByTeacherId = async(req, res) => {

    try{
        /** @params : id_school and id_teacher */
        const school_id = await req.params.id;
        const teacher_id = await req.params.teacher_id
        params = await req.params;
        const school = await cabinet.getSchoolProfileById(params)
        const teacher = await cabinet.getProfileByTeacherId(params)
        const d =  teacher[0].birthday.getDate();
        const m =  teacher[0].birthday.getMonth();
        const month = ['января', 'февраля','марта', 'апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'];
        const y =  teacher[0].birthday.getFullYear();
        const birthdayShort = `${d}  ${month[m]} ${y}`;
        const kpk = await cabinet.getAllKpkByIdTeacher(params)
        const discipline = await cabinet.getTeacherDisciplines(params)
        const project_id = await req.params.project_id
        const issetInProjects = await cabinet.getInformationAboutIssetTeacherInProject(req.params)
        
        
        return  res.render('admin_teacher_profile', {
                layout: 'admin',
                title: 'Профиль учителя',
                school,
                school_id,
                teacher,
                birthdayShort,
                kpk,
                discipline,
                teacher_id,
                project_id,
                issetInProjects,
                notice: req.flash('notice')
            })

    }catch(e) {
        console.log(e.message)
    }
}
/** END BLOCK */



/** GET SCHOLS BY AREA FILTER  */

exports.getShoolsByAreaId = async (req, res) => {
    try {
  
        const area_id = await req.body;
        const selected_id = await req.body.area_id
        const schools = await cabinet.getSchoolsByAreaId(area_id)
        const areas =  await cabinet.getAllArea()

        return  res.render('admin_main_list_schools', {
                layout: 'admin',
                title: 'Список (база) ОУ ЧР',
                schools,
                selected_id,
                areas,
                error: req.flash('error'),
                notice: req.flash('notice')
            })

    }catch(e) {
        console.log(e)
    }
}

/** END BLOCK */



/** GET  COMMON TEACHERS AND MEMBERS FROM PROJECT  */

exports.getSchoolsTeacherLibrary3 = async(req, res) => {

    try{
        const id = await req.params;

        const school = await cabinet.getSchoolProfileById(id)
        
        const common_data = await Teacher.getAllTeachersNotMembersInCurrentProject(id)

        const members_current_project_teachers = await Teacher.getAllTeachersFromThisSchoolFromCurrentProject(req.params)
      
        const project_id = await req.params.project_id;
        const project = await cabinet.getInfoFromProjectById(req.params.project_id)
        const name_project = await project[0].name_project;
        const school_id = school[0].id_school
      
        if(school) {
        return  res.render('library_list', {
                layout: 'admin',
                title: 'Добавить в проект',
                school,
                school_id,
                common_data,
                members_current_project_teachers,
                project_id,
                name_project,
                error: req.flash('error'),
                notice: req.flash('notice')
            })
        }
        
    }catch(e) {
        console.log(e.message)
    }
}

/** END BLOCK */



/** GET SCHOOL LIST FOR ADD IN CURRENT PROJECT  */

exports.select_school_for_add_in_project = async(req,res) => {

    try {

        //Все школы участвующие в проекте
        const current_project_data = await cabinet.getAllSchoolsFromThisProjects(req.params)
        
        const project_id = await req.params.id

        //информация по текущему проекту
        const this_project_information = await cabinet.getInfoFromProjectById(project_id)

        //общее кол-во учителей
        const total_value_teacher_current_project = await cabinet.getTotalValueTeacherFromProject(req.params)

        // console.log( total_value_teacher_current_project)

        //общее кол-во школ 
        const total_value_schools_current_project = await cabinet.getTotalValueSchoolFromProject(req.params)

        //LIMITED 10 ROWS LAST ADDED SCHOOLS
        // const schools = await cabinet.getAllSchoolProfiles()
        const areas =  await cabinet.getAllArea()

        const area_id = await req.body;
    
        const selected_id = await req.body.area_id

        const schools = await cabinet.getSchoolsByAreaId(area_id)

        const school_isset_in_project = await cabinet.getSchoolFromCurrentProject(req.body);

      
        for(let i  = 0; i < schools.length; i++) {
            schools[i].link = 'add_in_current_project'
            for(let o = 0; o < school_isset_in_project.length; o++) {
                if(schools[i].id_school == school_isset_in_project[o].school_id) {
                    schools[i].link = 'delete_from_current_project'
                }
            }
        }

        return res.render('admin_project_panel', {
            layout: 'admin',
            title: 'ПРОЕКТ| ' + this_project_information[0].name_project,
            project_main: current_project_data,
            project_heading:this_project_information[0].name_project,
            project_id: this_project_information[0].id_project,
            total_teachers: total_value_teacher_current_project[0].count,
            total_schools: total_value_schools_current_project[0].count,
            areas,
            selected_id,
            schools,
            error: req.flash('error'),
            notice: req.flash('notice')
        })

    }catch(e) {
        console.log(e)
    }
    
}

/** END BLOCK */

/** ИЗМЕНИТЬ СТАТУС АККАУНТ  */

exports.changeStatusSchool = async(req,res) => {

    try {
        console.log(req.params)

        const changeStatusSchool = await cabinet.changeStatusSchool(req.params)

        if(changeStatusSchool.affectedRows) {
            req.flash('notice', notice_base.success_update_sql);
            return res.status(200).redirect('/admin/projects/'+req.params.project_id+'/schools')
            // admin/projects/2/schools
        }else {
            req.flash('error', error_base.error_update );
            return res.status(422).redirect('/admin/projects/'+req.params.project_id+'/schools')
        }


            return true


    }catch(e) {
        console.log(e)
    }

}

/** END BLOCK */



/** ADD SCHOOL IN CURRENT PROJECT WITH REDIRECT THE SAME PAGE */

exports.add_in_current_project = async (req, res) => {
    
    try {

        const addingResult = await cabinet.insertSchoolInProject(req.params)

    

        if (addingResult) {
             //Все школы участвующие в проекте
            const current_project_data = await cabinet.getAllSchoolsFromThisProjects(req.params)

            const project_id = await req.params.id

            //информация по текущему проекту
            const this_project_information = await cabinet.getInfoFromProjectById(project_id)
        
            //общее кол-во учителей
            const total_value_teacher_current_project = await cabinet.getTotalValueTeacherFromProject(req.params)
        
            // console.log( total_value_teacher_current_project)

            //общее кол-во школ 
            const total_value_schools_current_project = await cabinet.getTotalValueSchoolFromProject(req.params)
        

            //LIMITED 10 ROWS LAST ADDED SCHOOLS
            // const schools = await cabinet.getAllSchoolProfiles()
            const areas =  await cabinet.getAllArea()

            const id =  await req.params;
            
            // const selected_id = await req.body.id
        
            const data = await req.params;

            const selected_id = await cabinet.getAreaIdBySchoolId(data)

            const id_area = await cabinet.getAreaIdBySchoolId(data)

            req.params.area_id = selected_id[0].area_id;
            
            const schools = await cabinet.getSchoolsByAreaId(req.params)

            const school_isset_in_project = await cabinet.getSchoolFromCurrentProject(id);

            for(let i  = 0; i < schools.length; i++) {
                schools[i].link = 'add_in_current_project'
                for(let o = 0; o < school_isset_in_project.length; o++) {
                    if(schools[i].id_school == school_isset_in_project[o].school_id) {
                        schools[i].link = 'delete_from_current_project'
                    }
                }
                
            }

            return res.render('admin_project_panel', {
                layout: 'admin',
                title: 'ПРОЕКТ| ' + this_project_information[0].name_project,
                project_main: current_project_data,
                project_heading:this_project_information[0].name_project,
                project_id: this_project_information[0].id_project,
                total_teachers: total_value_teacher_current_project[0].count,
                total_schools: total_value_schools_current_project[0].count,
                areas,
                selected_id: selected_id[0].area_id,
                schools,
                error: req.flash('error'),
                notice: req.flash('notice')
            })
        }else {
            throw new Error('Пал бу хун')
        } 

    }catch(e) {
        console.log(e)
    }
    
}

/** END BLOCK */



/** DELETE SCHOOL FROM CURRENT PROJECT */

exports.delete_from_current_project = async (req, res) => {
    
    try {

        const deleteRows = await cabinet.deleteSchoolFromCurrentProject(req.params)

        if (deleteRows) {
             //Все школы участвующие в проекте
            const current_project_data = await cabinet.getAllSchoolsFromThisProjects(req.params)

            const project_id = await req.params.id

            //информация по текущему проекту
            const this_project_information = await cabinet.getInfoFromProjectById(project_id)
        
            //общее кол-во учителей
            const total_value_teacher_current_project = await cabinet.getTotalValueTeacherFromProject(req.params)
        
            // console.log( total_value_teacher_current_project)

            //общее кол-во школ 
            const total_value_schools_current_project = await cabinet.getTotalValueSchoolFromProject(req.params)
        

            //LIMITED 10 ROWS LAST ADDED SCHOOLS
            // const schools = await cabinet.getAllSchoolProfiles()
            const areas =  await cabinet.getAllArea()

            const id =  await req.params;
            
            // const selected_id = await req.body.id
        
            const data = await req.params;

            const selected_id = await cabinet.getAreaIdBySchoolId(data)

            console.log(selected_id)

            const id_area = await cabinet.getAreaIdBySchoolId(data)

            req.params.area_id = selected_id[0].area_id;
            
            const schools = await cabinet.getSchoolsByAreaId(req.params)


            const school_isset_in_project = await cabinet.getSchoolFromCurrentProject(id);
        
            for(let i  = 0; i < schools.length; i++) {
                schools[i].link = 'add_in_current_project'
                for(let o = 0; o < school_isset_in_project.length; o++) {
                    if(schools[i].id_school == school_isset_in_project[o].school_id) {
                        schools[i].link = 'delete_from_current_project'
                    }
                }
                
            }

            return res.render('admin_project_panel', {
                layout: 'admin',
                title: 'ПРОЕКТ| ' + this_project_information[0].name_project,
                project_main: current_project_data,
                project_heading:this_project_information[0].name_project,
                project_id: this_project_information[0].id_project,
                total_teachers: total_value_teacher_current_project[0].count,
                total_schools: total_value_schools_current_project[0].count,
                areas,
                selected_id: selected_id[0].area_id,
                schools,
                error: req.flash('error'),
                notice: req.flash('notice')
            })
        }else {
            throw new Error('Пал бу хун')
        } 

    }catch(e) {
        console.log(e)
    }
}

/** END BLOCK */
