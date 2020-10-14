const {Router} = require('express')
const router = Router()
const cntrlCabinet = require('../../controllers/admin/add_new_cabinet_form_gener_ctrl')



router.get('/', cntrlCabinet.getAllDataForAddCabinet)

router.post('/', cntrlCabinet.getAllDataForAddCabinet)



module.exports = router