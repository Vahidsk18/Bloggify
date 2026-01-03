const User = require('../models/user')
const { createTokenForUser, validateToken } = require('../service/auth')

//for render sign in,up pages
function userSignin(req, res) {
    res.render('login')
}

function userSignup(req, res) {
    res.render('signup')
}


//create user & login
async function userCreation(req, res) {
    const { fullName, email, password } = req.body;
    // console.log(fullName,email,password)
    await User.create({
        fullName,
        email,
        password,
    });
    return res.redirect('/user/signin')
}

async function userLogin(req, res) {
    const { email, password } = req.body;
    try {
        const userToken = await User.matchPasswordAndGenerateToken(email, password)
        // console.log(userToken);
        return res.cookie('token', userToken).redirect('/')

    } catch (error) {
        return res.render('login', {
            error: "wrong credentials"
        })
    }

    // res.redirect('/')


}

//logout user
function userLogout(req, res) {

    return res.clearCookie('token').redirect('/')

}



module.exports = {
    userSignin,
    userSignup,
    userCreation,
    userLogin,
    userLogout,
}