const {Router} = require('express')
const router = Router()
const cntrProject = require('../../controllers/project_controller')


router.get('/', cntrProject.all)

module.exports = router