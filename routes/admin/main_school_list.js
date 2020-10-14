const {Router} = require('express')
const schoolCtrl = require('../../controllers/admin/school')
const {validationResult} = require('express-validator')
const {validatorForAddTeacherAdmin} = require('../../utils/validator')
// const auth = require('../../middleware/auth')

const router = Router()

router.get('/',  schoolCtrl.getMainListSchools )

router.post('/area', schoolCtrl.getShoolsByAreaId)

router.get('/:id', schoolCtrl.getSchoolProfileById)

router.get('/:id/:teacher_id/:project_id', schoolCtrl.getProfileByTeacherIdInProject)

router.get('/:id/:teacher_id/', schoolCtrl.getProfileByTeacherId)

router.post('/add_teacher_in_school', validatorForAddTeacherAdmin, schoolCtrl.insertNewTeacherInThisSchoolBase)


module.exports = router