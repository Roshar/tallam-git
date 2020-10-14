const {Router} = require('express')
const teacherCntrl = require('../../controllers/admin/teacher')
// const {validationResult} = require('express-validator')
// const {validatorForAddTeacherAdmin} = require('../../utils/validator')

const router = Router()

router.get('/edit/main_data/:teacher_id/:school_id', teacherCntrl.getFormForEditTeacher)

router.get('/delete_profile/:teacher_id/:school_id', teacherCntrl.deleteTeacherProfileById)

router.post('/edit_teacher', teacherCntrl.updateTeacherMainInformationById)

module.exports = router