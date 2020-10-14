const {Router} = require('express')
const router = Router()
const accounts = require('../../controllers/admin/accounts')

router.get('/', accounts.getAllAccounts)
router.post('/', accounts.getAllAccounts)

module.exports = router