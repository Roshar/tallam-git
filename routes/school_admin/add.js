const {Router} = require('express')
const router = Router()



router.get('/', (req, res) => {
    console.log(req.session)
    res.render('global_add', {
        title: 'Добавить',
        isAdd: true
    })
})

module.exports = router