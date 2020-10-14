const cabinet = require('../../models/admin/Cabinet');

exports.getAllDataForAddCabinet = async function(req,res) {
    const areas = await cabinet.getAllArea()
    const types = await cabinet.getTypes()

    let schools = null;
    
    if (req.body.area_id) { 
        schools = await cabinet.getSchoolsByAreaId(req.body)
    }
    if (req.xhr) {
        return res.json(schools);   
    }
    
    return res.render ('admin_add_new_cabinet',  {
        layout: 'admin',
        title: 'Создать новый личный кабинет',
        areas,
        types,
        schools,
        error: req.flash('error'),
        notice: req.flash('notice')
    })
}

