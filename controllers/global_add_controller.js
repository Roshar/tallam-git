 // const projects = require('../models/Project')

exports.all = async function(req,res) {
    const result = await projects.all()
    console.log(result)
    res.render ('projects', {
        title:'Пректы',
        result
    })
}

