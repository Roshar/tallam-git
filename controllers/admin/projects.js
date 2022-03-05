const cabinet = require('../../models/admin/Cabinet')
const Teacher = require('../../models/admin/Teacher')
const {validationResult} = require('express-validator')
const error_base = require('../../helpers/error_msg');
const notice_base = require('../../helpers/notice_msg')
const { v4: uuidv4 } = require('uuid');



/** SELECT ALL PROJECTS */

exports.index = async (req, res) => {
    try{

        const projects = await cabinet.getAllProjects()

        return res.render('admin_projects', {
            layout: 'admin',
            title: 'Админ|проекты',
            projects,
            error: req.flash('error'),
            notice: req.flash('notice')
        })
        
    }catch(e) { 
        console.log(e.message)
    }
}

/** END BLOCK */



exports.selectProjects = async (req, res) => {
    try{

        //Все школы участвующие в проекте
        const current_project_data = await cabinet.getAllSchoolsFromThisProjects(req.params)

        const project_id = await req.params.id

        //информация по текущему проекту
        const this_project_information = await cabinet.getInfoFromProjectById(project_id)

        //общее кол-во учителей
        const total_value_teacher_current_project = await cabinet.getTotalValueTeacherFromProject(req.params)

        //общее кол-во школ 
        const total_value_schools_current_project = await cabinet.getTotalValueSchoolFromProject(req.params)

        //LIMITED 10 ROWS LAST ADDED SCHOOLS
        // const schools = await cabinet.getAllSchoolProfiles()
        const areas =  await cabinet.getAllArea()


        return  res.render('admin_project_panel', {
                layout: 'admin',
                title: 'ПРОЕКТ| ' + this_project_information[0].name_project,
                project_main: current_project_data,
                project_heading:this_project_information[0].name_project,
                project_id: this_project_information[0].id_project,
                total_teachers: total_value_teacher_current_project[0].count,
                total_schools: total_value_schools_current_project[0].count,
                areas,
                error: req.flash('error'),
                notice: req.flash('notice')
            })
        
    }catch(e) { 
        console.log(e.message)
    }
}

/** END BLOCK */



/** SELECT ALL SCHOOLS FROM PROJECT */

exports.selectSchoolsByProjectId = async(req, res) => {

    try{
        //Все школы участвующие в проекте
        const current_project_data = await cabinet.getAllSchoolsFromThisProjects(req.params)

        //информация по текущему проекту
        const project_id = req.params.id
        const this_project_information = await cabinet.getInfoFromProjectById(project_id)
        const projects = await cabinet.getAllProjects()



        return  res.render('admin_project_panel_schools', {
                layout: 'admin',
                title: 'ПРОЕКТ| ' + this_project_information[0].name_project,
                project_schools: current_project_data,
                project_heading:this_project_information[0].name_project,
                project_id: this_project_information[0].id_project,
                error: req.flash('error'),
                notice: req.flash('notice')
            })
        
    }catch(e) { 
        console.log(e.message)
    }

}

/** END BLOCK */



/** SELECT ALL TEACHERS FROM PROJECT */

exports.selectTeachersByProjectId = async(req, res) => {

    try{
        //информация по текущему проекту
        const current_project_data = await cabinet.getInfoFromProjectById(req.params.project_id);
        let teachersFromCurrentProject = '';
        if(req.params.teacher_id) {
            teachersFromCurrentProject = await Teacher.getAllTeachersFromCurrentProjectWithFilter(req.params) 
        }else {
            teachersFromCurrentProject = await Teacher.getAllTeachersFromCurrentProject(req.params)
        }
        if (req.body.name) { 
            
            teachersFromCurrentProject = await Teacher.getTeachersByLastNameFilter(req.body)
        }
        if (req.xhr) {
            return res.json(teachersFromCurrentProject);
            
        }
        const projects = await cabinet.getAllProjects()
        
        return  res.render('admin_project_panel_teachers', {
                layout: 'admin',
                title: 'ПРОЕКТ| ' + current_project_data[0].name_project, 
                project_heading:current_project_data[0].name_project,
                project_id: current_project_data[0].id_project,
                teachersFromCurrentProject,
                error: req.flash('error'),
                notice: req.flash('notice')
            })
        
    }catch(e) { 
        console.log(e.message)
    }
}

/** END BLOCK */



/** SELECT ALL TEACHERS FROM PROJECT BY FIRST SURNAME LETTER AS ID */

exports.selectTeachersByProjectIdAndLatterFilter = async(req, res) => {

    try{
        //информация по текущему проекту
        const current_project_data = await cabinet.getInfoFromProjectById(req.params.project_id);
        let teachersFromCurrentProject = '';
        if(req.params.letter) {
            const letter = await req.params.letter;
            teachersFromCurrentProject = await Teacher.selectTeachersByProjectIdAndLatterFilter(req.params)
        }
        if (req.body.name) { 
            teachersFromCurrentProject = await Teacher.getTeachersByLastNameFilter(req.body)
        }

        if (req.xhr) {
            return res.json(teachersFromCurrentProject); 
        }
        const projects = await cabinet.getAllProjects()
        return  res.render('admin_project_panel_teachers', {
                layout: 'admin',
                title: 'ПРОЕКТ| ' + current_project_data[0].name_project, 
                project_heading:current_project_data[0].name_project,
                project_id: current_project_data[0].id_project,
                teachersFromCurrentProject,
                error: req.flash('error'),
                notice: req.flash('notice')
            })
    }catch(e) { 
        console.log(e.message)
    }
}

/** END BLOCK */



/** UPDATE STATUS in column IN_PROJECT_STATUS (add in current project)*/

exports.addTeacherInCurrentProject = async (req, res) => {
    try{
        const {school_id, project_id} = await req.params;
        const result = await Teacher.addCurrentProjectByChangeStatus(req.params)
        if(result) {
            req.flash('notice', notice_base.success_insert_sql );
            return res.status(200).redirect(`/admin/projects/library/${school_id}/${project_id}`);
        }else {
            req.flash('errors', error_base.wrong_sql_insert);
        }
        
    }catch(e) { 
        console.log(e.message)
    }
}

/** END BLOCK */



/** UPDATE STATUS in column IN_PROJECT_STATUS (delete in current project)*/

exports.deleteFromCurrentProjectByChangeStatus = async (req, res) => {
    try{
        const {school_id, project_id} = await req.params;
        const result = await Teacher.deleteFromCurrentProjectByChangeStatus(req.params)
        if(result) {
            req.flash('notice', notice_base.success_insert_sql );
            return res.status(200).redirect(`/admin/projects/library/${school_id}/${project_id}`);
        }else {
            req.flash('errors', error_base.wrong_sql_insert);
        }
    }catch(e) { 
        console.log(e.message)
    }
}

/** END BLOCK */




