const {Router} = require('express')
const router = Router()
const cntrTest = require('../controllers/testController')

router.get('/', cntrTest.all)

module.exports = router

