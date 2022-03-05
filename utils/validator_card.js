const {body} = require('express-validator')

exports.validatorForAddMark  = [
    body('discipline_id','Заполните все обязательные поля!').toInt().isInt(),
    body('class_id','Заполните все обязательные поля!').notEmpty().toInt().isInt(),
    body('liter_class').escape().trim(),
    body('source_id','Заполните все обязательные поля!').toInt().isInt(),
    body('id_teacher','Заполните все обязательные поля!').notEmpty().trim(),
    body('school_id','Заполните все обязательные поля!').notEmpty().toInt().isInt(),
    body('project_id','Заполните все обязательные поля!').notEmpty().toInt().isInt(),
    body('thema','Заполните все обязательные поля!').notEmpty().escape().trim(),
    body('k_1_1','Заполните все обязательные поля!').toInt().isInt(),
    body('k_1_2','Заполните все обязательные поля!').toInt().isInt(),
    body('k_1_3','Заполните все обязательные поля!').toInt().isInt(),
    body('k_2_1','Заполните все обязательные поля!').toInt().isInt(),
    body('k_2_2','Заполните все обязательные поля!').toInt().isInt(),
    body('k_3_1','Заполните все обязательные поля!').toInt().isInt(),
    body('k_4_1','Заполните все обязательные поля!').toInt().isInt(),
    body('k_5_1','Заполните все обязательные поля!').toInt().isInt(),
    body('k_5_2','Заполните все обязательные поля!').toInt().isInt(),
    body('k_6_1','Заполните все обязательные поля!').toInt().isInt(),
    
    // body('total_experience').custom( (value, {req}) => {
    //     if(parseInt(value) < parseInt(req.body.teaching_experience)) {
    //         throw new Error('Общий стаж не может быть меньше педагогического')
    //     }
    // })
    
]