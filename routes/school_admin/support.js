const {Router} = require('express')
const auth = require('../../middleware/auth')

const cntrlSupport = require('../../controllers/school_admin/school_support');

const router = Router()

router.get('/', cntrlSupport.index)

module.exports = router