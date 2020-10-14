const {Router} = require('express')
const auth = require('../../middleware/auth')
const {body, validationResult} = require('express-validator')
const school_cabinetCtrl = require('../../controllers/school_admin/school_cabinet')

const router = Router()


router.get('/', school_cabinetCtrl.getSchoolData)
router.post('/', body('email').isEmail(), body('message').notEmpty(), school_cabinetCtrl.getSchoolData)


module.exports = router

