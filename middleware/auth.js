const { validateToken } = require('../service/auth')


function checkForAuthCookie(req, res, next) {
    const tokenCookieValue = req.cookies.token

    if (!tokenCookieValue) return next();

    // console.log("cookie", tokenCookieValue);

    try {
        const userpayload = validateToken(tokenCookieValue);
        // console.log("payload", userpayload);  //cookie obj
        req.isLoggedInUser = userpayload

    } catch (error) { }

    next()

}


function noCache(req, res, next) {
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, private");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    next();
}



module.exports = {
    checkForAuthCookie,
    noCache,
}