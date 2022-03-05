const SchoolProject = require('../../models/school_admin/SchoolProject')
const SchoolCabinet = require('../../models/school_admin/SchoolCabinet')
const SchoolTeacher = require('../../models/school_admin/SchoolTeacher')
const {validationResult} = require('express-validator')
const error_base = require('../../helpers/error_msg');
const notice_base = require('../../helpers/notice_msg')
const { v4: uuidv4 } = require('uuid');



/**
 *  Раздел с проектами
 * GET  PROJECTS LIST
 * Личный кабинет школы
 * */


exports.getProjectsCurrentSchool = async (req, res) => {

    try{
        if(req.session.user) {
            const projects = await SchoolProject.getAllProjectsWithThisSchool(req.session.user)
            const school = await SchoolCabinet.getSchoolData(req.session.user)
            const support_type = await SchoolCabinet.getSupportType()
            const school_name = await school[0].school_name;
            const title_area = await school[0].title_area;
    
            return res.render('school_projects', {
                layout: 'main',
                title: school_name,
                school_name,
                projects,
                title_area,
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




/**
 *  Раздел проект по ID
 * GET PROJECT BY ID
 * Личный кабинет школы
 * */

exports.getInformationByProjectId = async (req, res) => {
   
    try{

        if(req.session.user) {

            const school = await SchoolCabinet.getSchoolData(req.session.user)

            const support_type = await SchoolCabinet.getSupportType()

            const school_name = await school[0].school_name;

            const title_area = await school[0].title_area;

            const project = await SchoolProject.getInfoFromProjectById(req.params)

            const projectsIssetSchool = await SchoolProject.getAllProjectsWithThisSchool(req.session.user)

            // console.log(projectsIssetSchool)
            if(!project.length) {
                return res.status(422).redirect('/school/cabinet');
            }
            
            let resultA = []
            for(let i = 0; i < projectsIssetSchool.length; i++) {
                if(project[0].id_project == projectsIssetSchool[i].project_id) {
                    resultA.push(project[0].id_project)
                }
            }

            if(!resultA.length || resultA == 1) {
                return res.status(422).redirect('/school/cabinet');
            } 

            const teachers = await SchoolProject.getAllTeachersFromThisSchoolFromCurrentProject({
                'id_school': school[0].id_school,
                'id_project': project[0].id_project
            })

            return res.render('school_project_single', {
                layout: 'main',
                title: school_name,
                school_name,
                title_area,
                school,
                teachers,
                project_name: project[0].name_project,
                support_type,
                project_id: project[0].id_project,
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




/** GET  COMMON TEACHERS AND MEMBERS FROM PROJECT  */

exports.getSchoolsTeacherLibrary = async(req, res) => {

    try{
        // const id = await req.params;

        // const school = await cabinet.getSchoolProfileById(id)
        
        // -- const common_data = await Teacher.getAllTeachersNotMembersInCurrentProject(id)

        // -- const members_current_project_teachers = await Teacher.getAllTeachersFromThisSchoolFromCurrentProject(req.params)
      
        // -- const project_id = await req.params.project_id;
        // const project = await cabinet.getInfoFromProjectById(req.params.project_id)
        // const name_project = await project[0].name_project;
        // const school_id = school[0].id_school
      
        // if(school) {
        // return  res.render('library_list', {
        //         layout: 'admin',
        //         title: 'Добавить в проект',
        //         school,
        //         school_id,
        //         common_data,
        //         members_current_project_teachers,
        //         project_id,
        //         name_project,
        //         error: req.flash('error'),
        //         notice: req.flash('notice')
        //     })
        // }


        if(req.session.user) {

            const project = await SchoolProject.getInfoFromProjectById(req.params)

            const projectsIssetSchool = await SchoolProject.getAllProjectsWithThisSchool(req.session.user)

            if(!project.length) {
                return res.status(422).redirect('/school/cabinet');
            }
            
            let resultA = []
            for(let i = 0; i < projectsIssetSchool.length; i++) {
                if(project[0].id_project == projectsIssetSchool[i].project_id) {
                    resultA.push(project[0].id_project)
                }
            }

            if(!resultA.length || resultA == 1) {
                return res.status(422).redirect('/school/cabinet');
            } 

         
            const school = await SchoolCabinet.getSchoolData(req.session.user)


            const teachers = await SchoolProject.getAllTeachersFromThisSchoolFromCurrentProject({
                'id_school': school[0].id_school,
                'id_project': project[0].id_project
            })

            

            const common_data = await SchoolTeacher.getAllTeachersNotMembersInCurrentProject({
                'id_school': school[0].id_school,
                'id_project': project[0].id_project
            })

            const members_current_project_teachers = await SchoolTeacher.getAllTeachersFromThisSchoolFromCurrentProject({
                'id_school': school[0].id_school,
                'id_project': project[0].id_project
            })

            const support_type = await SchoolCabinet.getSupportType()

            const school_name = await school[0].school_name;

            const title_area = await school[0].title_area;

            return res.render('school_library_list', {
                layout: 'main',
                title: 'Участники проекта',
                school_name,
                title_area,
                common_data,
                members_current_project_teachers,
                school,
                teachers,
                project_name: project[0].name_project,
                support_type,
                project,
                project_id: project[0].id_project,
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



/** UPDATE STATUS in column IN_PROJECT_STATUS (delete in current project)*/

exports.deleteFromCurrentProjectByChangeStatus = async (req, res) => {
    try{
      
        if(req.session.user) {

            const project = await SchoolProject.getInfoFromProjectById(req.params)

            const teacher = await SchoolTeacher.getProfileByTeacherId(req.params)
    
            if(!teacher.length) {
                return res.status(422).redirect('/school/cabinet');
            }

            const projectsIssetSchool = await SchoolProject.getAllProjectsWithThisSchool(req.session.user)

            if(!project.length) {
                return res.status(422).redirect('/school/cabinet');
            }
            
            let resultA = []
            for(let i = 0; i < projectsIssetSchool.length; i++) {
                if(project[0].id_project == projectsIssetSchool[i].project_id) {
                    resultA.push(project[0].id_project)
                }
            }

            if(!resultA.length || resultA == 1) {
                return res.status(422).redirect('/school/cabinet');
            } 

            const result = await SchoolProject.deleteFromCurrentProjectByChangeStatus(req.params)
            
            if(result) {
                req.flash('notice', notice_base.success_insert_sql );
                return res.status(200).redirect(`/school/project/library/${project[0].id_project}`);
            }else {
                req.flash('errors', error_base.wrong_sql_insert);
                return res.status(200).redirect(`/school/project/library/${project[0].id_project}`);
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

/** END BLOCK */



/** UPDATE STATUS in column IN_PROJECT_STATUS (add in current project)*/

exports.addTeacherInCurrentProject = async (req, res) => {
    try{
        const project = await SchoolProject.getInfoFromProjectById(req.params)

        const teacher = await SchoolTeacher.getProfileByTeacherId(req.params)

        if(!teacher.length) {
            return res.status(422).redirect('/school/cabinet');
        }

        const projectsIssetSchool = await SchoolProject.getAllProjectsWithThisSchool(req.session.user)

        if(!project.length) {
            return res.status(422).redirect('/school/cabinet');
        }
        
        let resultA = []
        for(let i = 0; i < projectsIssetSchool.length; i++) {
            if(project[0].id_project == projectsIssetSchool[i].project_id) {
                resultA.push(project[0].id_project)
            }
        }

        if(!resultA.length || resultA == 1) {
            return res.status(422).redirect('/school/cabinet');
        } 
        
        const result = await SchoolProject.addCurrentProjectByChangeStatus(req.params)

        if(result) {
            req.flash('notice', notice_base.success_insert_sql );
            return res.status(200).redirect(`/school/project/library/${project[0].id_project}`);
        }else {
            req.flash('errors', error_base.wrong_sql_insert);
            return res.status(200).redirect(`/school/project/library/${project[0].id_project}`);
        }

        
    }catch(e) { 
        console.log(e.message)
    }
}

/** END BLOCK */
