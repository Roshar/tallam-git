const {Router} = require('express')
const router = Router()


router.get('/',  (req,res) => {
    res.render('global_list',{
        title: 'Список работников',
        isList: true
    })
})

module.exports = router