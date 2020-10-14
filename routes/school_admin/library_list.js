const {Router} = require('express')

const router = Router()

router.get('/', (req, res) => {
    res.render('library_list', {
        title: 'Список участвующих в проекте',
        isLibrary: true
    })
})

module.exports = router