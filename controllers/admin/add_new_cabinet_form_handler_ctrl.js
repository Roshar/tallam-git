const {validationResult} = require('express-validator')
const error_base = require('../../helpers/error_msg');
const notice_base = require('../../helpers/notice_msg')
const cabinet = require('../../models/admin/Cabinet')
const bcrypt = require('bcryptjs')

exports.testCntrl = async (req,res) => {
    try{ 
        const {email, password, confirm} = await req.body;
        const errors = validationResult(req);
        const candidate = await cabinet.getUserByEmail(req.body)
        if(!errors.isEmpty()){
            req.flash('error', error_base.error_message);
            return res.status(422).redirect('/admin/add_new_cabinet/');  
         }
         
        if (candidate.length > 0) {
             req.flash('error', error_base.uniq_error );
             return res.status(422).redirect('/admin/add_new_cabinet/'); 
         }

        if(password.length > 5) {
            if(password == confirm) {   
               const ress =  await cabinet.createNewCabinet(req.body);
               if (ress) {
                     req.flash('notice', notice_base.success_insert_sql);
                     return res.status(200).redirect('/admin/add_new_cabinet/');
               }else {
                    req.flash('error', error_base.wrong_sql_insert);
                    return res.status(422).redirect('/admin/add_new_cabinet/');
               }
            }else {
                req.flash('error', error_base.confirm_error);
                return res.status(422).redirect('/admin/add_new_cabinet/');
            }
        }else {
            req.flash('error', error_base.password_length);
            return res.status(422).redirect('/admin/add_new_cabinet/');
        }
    }catch(e) {
        console.log(e.message)
    }
    
    
}
