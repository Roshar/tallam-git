const {Router} = require('express')
const auth = require('../../middleware/auth')
const {body, validationResult} = require('express-validator')
const {validatorForAddTeacherAdmin} = require('../../utils/validator')
const school_teacherCtrl = require('../../controllers/school_admin/school_teacher')

const router = Router()

router.post('/edit/:teacher_id', school_teacherCtrl.getTeacherByIdForEdit)

router.get('/edit/:teacher_id', school_teacherCtrl.getTeacherByIdForEdit)

router.get('/delete_profile/:teacher_id', school_teacherCtrl.deleteTeacherProfileById)

router.get('/:teacher_id', school_teacherCtrl.getProfileByTeacherId)

router.post('/', validatorForAddTeacherAdmin, school_teacherCtrl.getSchoolTeachers)  

router.post('/upload', school_teacherCtrl.avatar)

router.get('/', school_teacherCtrl.getSchoolTeachers)

module.exports = router