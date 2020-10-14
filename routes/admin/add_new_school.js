const {Router} = require('express')
const {body, validationResult} = require('express-validator')
const addNewSchoolCtrl = require('../../controllers/admin/school')

const router = Router()

router.get('/', addNewSchoolCtrl.generationFormForAddNewSchool)

router.post('/',  addNewSchoolCtrl.handle)

module.exports = router