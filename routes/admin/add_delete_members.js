const {Router} = require('express')
const projectsCtrl = require('../../controllers/admin/projects')


const router = Router()

 router.get('/add/:id/:school_id/:project_id', projectsCtrl.addTeacherInCurrentProject)

 router.get('/delete_in_project/:id/:school_id/:project_id', projectsCtrl.deleteFromCurrentProjectByChangeStatus)

module.exports = router