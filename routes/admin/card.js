const {Router} = require('express')
const cardCntrl = require('../../controllers/admin/card')
const {validationResult} = require('express-validator')
const {validatorForAddTeacherAdmin} = require('../../utils/validator')
//const router = require('../cabinet')
const router = Router()

router.post('/school/:id_school/teacher/:id_teacher/project/:id_project/filter/', cardCntrl.getCardPageByTeacherIdWithFilter)
//router.post('/school/:id_school/teacher/:id_teacher/project/:id_project/', cardCntrl.getCardPageByTeacherId)
router.get('/school/:id_school/teacher/:id_teacher/project/:id_project/', cardCntrl.getCardPageByTeacherId)
router.post('/addhandle/school/:id_school/teacher/:id_teacher/project/:id_project/', cardCntrl.addHandleMarkForTeacher)
router.get('/add/school/:id_school/teacher/:id_teacher/project/:id_project/', cardCntrl.addMarkForTeacher)



module.exports = router

