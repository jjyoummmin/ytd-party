//auth 관련 미들웨어
function validateLoggedIn (req,res,next){
    if(req.isAuthenticated()){
        next();
    }else{
        res.redirect('/loginPage');
    }
}

function validateNogLoggedIn(req, res,next){
    if(!req.isAuthenticated()){
        next();
    }else{
        res.redirect('/home');
    }

}

module.exports = {validateLoggedIn, validateNogLoggedIn}