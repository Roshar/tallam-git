const {Router} = require('express')
const auth = require('../../middleware/auth')
const {body, validationResult} = require('express-validator')
const school_projectCtrl = require('../../controllers/school_admin/school_project')

const router = Router()


router.get('/', school_projectCtrl.getProjectsCurrentSchool)

router.get('/:project_id/add/:teacher_id', school_projectCtrl.addTeacherInCurrentProject )

router.get('/:project_id', school_projectCtrl.getInformationByProjectId)

router.get('/library/:project_id', school_projectCtrl.getSchoolsTeacherLibrary)

router.get('/library/:project_id/delete_in_project/:teacher_id', school_projectCtrl.deleteFromCurrentProjectByChangeStatus)




module.exports = router