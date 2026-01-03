const { Schema, model } = require('mongoose')
const { createHmac, randomBytes } = require('crypto');
const { createTokenForUser } = require('../service/auth')


const userSchema = new Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    salt: {
        type: String,
    },
    password: {
        type: String,
        required: true
    },
    profileImgURL: {
        type: String,
        default: '/images/useravtar.png',

    },
    role: {
        type: String,
        enum: ['USER', 'ADMIN'],
        default: 'USER',
    }
}, { timestamps: true });

//for hashing pass
userSchema.pre('save', function () {
    const user = this;

    if (!user.isModified('password')) return;

    const salt = randomBytes(16).toString();
    const hashedPass = createHmac('sha256', salt)
        .update(user.password)
        .digest('hex');

    user.salt = salt;
    user.password = hashedPass;
});


//for un-hashing pass
userSchema.static("matchPasswordAndGenerateToken", async function (email, password) {
    const user = await this.findOne({ email })
    // console.log(user);
    if (!user) throw new Error("user not found")

    const salt = user.salt;
    const alreadyHashedPassword = user.password;

    const userProvidedPass = createHmac('sha256', salt)
        .update(password)
        .digest('hex');

    if (alreadyHashedPassword !== userProvidedPass) throw new Error("Pass is Wrong")
    return createTokenForUser(user);
})


const User = model('user', userSchema)
module.exports = User;