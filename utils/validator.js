const {body} = require('express-validator')

exports.validatorForAddTeacherAdmin  = [
    body('surname','Заполните все обязательные поля!').notEmpty().escape().trim(),
    body('firstname','Заполните все обязательные поля!').notEmpty().escape().trim(),
    body('patronymic').escape().trim(),
    body('snils','Вы пытаетесь внести вместо цифр буквы!').escape().trim(),
    //body('email', 'Некорректный почтовый адрес').isEmail(),
    body('gender', 'Заполните все обязательные поля!').notEmpty().toInt(),
    body('position', 'Заполните все обязательные поля!').notEmpty().toInt(),
    body('category', 'Заполните все обязательные поля!').notEmpty().toInt(),
    body('phone').escape().trim(),
    body('email').escape().trim(),
    body('place_kpk').escape().trim(),
    // body('total_experience').custom( (value, {req}) => {
    //     if(parseInt(value) < parseInt(req.body.teaching_experience)) {
    //         throw new Error('Общий стаж не может быть меньше педагогического')
    //     }
    // })
    
]


