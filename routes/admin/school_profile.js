const {Router} = require('express')
const schoolCtrl = require('../../controllers/admin/school')

const router = Router()

router.get('/:id', (req, res) => {
    console.log(req)
} )

router.post('/add_teacher_in_school', )


module.exports = router