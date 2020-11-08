const SchoolCabinet = require('../../models/school_admin/SchoolCabinet');
const {validationResult} = require('express-validator');
const error_base = require('../../helpers/error_msg');
const notice_base = require('../../helpers/notice_msg');
const { v4: uuidv4 } = require('uuid');
const mailer = require('../../library/nodemailer');

/** GET SUPPORT PAGE */

exports.index = async (req, res) => {
    try{

      if(req.session.user) {
        const school = await SchoolCabinet.getSchoolData(req.session.user)
        const support_type = await SchoolCabinet.getSupportType()
        const school_name = await school[0].school_name;
        const title_area = await school[0].title_area;

        if(req.body.support_title){
          const subject_title = await req.body.support_title;
          const subject_content = await req.body.support_body;
          const message = {
            to: 'test.tallam@mail.ru',
            subject: `Сообщение от: ${req.session.user.email}, название ОО: ${school_name}, тема: ${subject_title} `,
            text: `Сообщение: ${subject_content}`
          }
          mailer(message);
          req.flash('notice', notice_base.success_mailed_message);
          return res.status(200).redirect(`/school/support`)
        }

        return res.render('support', {
            layout: 'main',
            title: school_name,
            school_name,
            title_area,
            support_type,
            error: req.flash('error'),
            notice: req.flash('notice')
        })

      }else {
        req.session.isAuthenticated = false
        req.session.destroy( err => {
            if (err) {
                throw err
            }else {
                res.redirect('/auth')
            } 
        })
      }

    }catch (e) {
        console.log(e)
    }
}

/** END BLOCK */