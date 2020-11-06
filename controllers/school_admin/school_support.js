const SchoolCabinet = require('../../models/school_admin/SchoolCabinet')
const {validationResult} = require('express-validator')
const error_base = require('../../helpers/error_msg');
const notice_base = require('../../helpers/notice_msg')
const { v4: uuidv4 } = require('uuid');



/** GET SUPPORT PAGE */

exports.index = async (req, res) => {
    try{

      if(req.session.user) {
        const school = await SchoolCabinet.getSchoolData(req.session.user)
        const support_type = await SchoolCabinet.getSupportType()
        const school_name = await school[0].school_name;
        const title_area = await school[0].title_area;



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