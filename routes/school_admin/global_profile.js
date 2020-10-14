const {Router} = require('express')
const router = Router()


router.get('/',  (req,res) => {
    res.render('global_profile',{
        title: 'Профиль',
        isProfile: true
    })
})

module.exports = router