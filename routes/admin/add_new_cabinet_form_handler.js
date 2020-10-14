const {Router} = require('express')
const router = Router()
const {body, validationResult} = require('express-validator')
const cntrlCabinetForm = require('../../controllers/admin/add_new_cabinet_form_handler_ctrl')


router.post('/',  body('email').isEmail(), cntrlCabinetForm.testCntrl)


module.exports = router