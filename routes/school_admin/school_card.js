const {Router} = require('express')
const auth = require('../../middleware/auth')
const {body, validationResult} = require('express-validator')
const {validatorForAddMark} = require('../../utils/validator_card')
const school_cardCtrl = require('../../controllers/school_admin/school_card')

const router = Router()


router.post('/single/:id_card/project/:project_id/:teacher_id', school_cardCtrl.getSingleCardById)
router.get('/single/:id_card/project/:project_id/:teacher_id', school_cardCtrl.getSingleCardById)
router.post('/project/:project_id/teacher/:teacher_id', school_cardCtrl.getCardPageByTeacherId)
router.get('/project/:project_id/teacher/:teacher_id', school_cardCtrl.getCardPageByTeacherId)
router.post('/add/project/:project_id/teacher/:teacher_id', validatorForAddMark, school_cardCtrl.addMarkForTeacher)
router.get('/add/project/:project_id/teacher/:teacher_id', school_cardCtrl.addMarkForTeacher)
router.get('/create_tbl_marks/teacher/:teacher_id/project/:project_id',school_cardCtrl.getAllMarksByTeacherId )

module.exports = router