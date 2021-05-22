function userAuth(req, res, next)
{
    if(req.session.userId != undefined)
    {
        next();
    }
    else
    {
        req.session.userId = undefined;
        req.session.name = undefined;
        req.session.email = undefined;
        req.session.currentRooms = undefined;
        res.redirect('/login');
    }
}

module.exports = userAuth;