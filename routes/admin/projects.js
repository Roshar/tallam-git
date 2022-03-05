const {Router} = require('express')
const projectsCtrl = require('../../controllers/admin/projects')
const schoolsCtrl = require('../../controllers/admin/school')

const router = Router()

//получаем все проекты 

router.get('/', projectsCtrl.index)

//выбираем нужный проект 

router.get('/:id', projectsCtrl.selectProjects)

router.post('/:id/select_school_for_add_in_project/', schoolsCtrl.select_school_for_add_in_project)
// /admin/projects/school/blocked
router.get('/school/status/:id_school/:project_id/:current_status', schoolsCtrl.changeStatusSchool)

router.get('/add_in_current_project/:id/:id_school/', schoolsCtrl.add_in_current_project)

router.get('/delete_from_current_project/:id/:id_school/', schoolsCtrl.delete_from_current_project)

router.get('/:id/schools', projectsCtrl.selectSchoolsByProjectId)

router.get('/school/:id/:project_id', schoolsCtrl.getSchoolProfileByIdWithFILTERcurrentProject)

router.get('/library/:id/:project_id', schoolsCtrl.getSchoolsTeacherLibrary3)

router.get('/:project_id/teachers/:teacher_id', projectsCtrl.selectTeachersByProjectId)

router.get('/:project_id/teachers', projectsCtrl.selectTeachersByProjectId)

router.get('/:project_id/list/surname/:letter', projectsCtrl.selectTeachersByProjectIdAndLatterFilter)

router.post('/:project_id/list/surname/:letter', projectsCtrl.selectTeachersByProjectIdAndLatterFilter)

router.post('/:project_id/teachers', projectsCtrl.selectTeachersByProjectId)






// router.post('/:project_id/add_in_project/', schoolsCtrl.addSchoolInProject)






module.exports = router