module.exports = (req, res, next)=>{
    if(req.session.isAdmin) {
        console.log('it is Admin!');
        return true;
    }
    next()
}