const Сabinet = require('../../models/admin/Cabinet')
const Teacher = require('../../models/admin/Teacher')
const Account = require('../../models/admin/Account')
const {validationResult} = require('express-validator')
const error_base = require('../../helpers/error_msg');
const notice_base = require('../../helpers/notice_msg')
const { v4: uuidv4 } = require('uuid');



/** GENERATION FORM FOR ADD NEW SCHOOL */

exports.getAllAccounts = async (req, res) => {
    try{
        if(req.body.id) {
            console.log(req.body.id)
        }
        const accounts = await Account.getAllCabinetsByAreaId(req.body)
        const areas =  await Сabinet.getAllArea()

        return res.render('admin_main_list_accounts', {
            layout: 'admin',
            title: 'Аккаунты школ',
            areas,
            accounts,
            error: req.flash('error'),
            notice: req.flash('notice')
        })

    }catch (e) {
        console.log(e)
    }
}

/** END BLOCK */