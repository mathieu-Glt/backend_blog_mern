module.exports.signUpErrors = (error) => {
    let errors = { pseudo: '', email: '', password: ''}

    if(error.message.includes('pseudo'))
    errors.pseudo = "Pseudo incorrect or already exists";

    if(error.message.includes('email'))
    errors.email = "Email incorrect";

    if(error.message.includes('password'))
    errors.password = "Password incorrect must be 6 characters";

    if(error.code === 11000 && Object.keys(error.keyValue)[0].includes('pseudo'))
    errors.pseudo = 'That pseudo already exists';

    if(error.code === 11000 && Object.keys(error.keyValue)[0].includes('email'))
    errors.email = 'That email already exists'

    return errors;
}


module.exports.signInErrors = (error) => {
    let errors = {  email: '', password: ''}

    if(error.message.includes('email'))
    errors.email = "Email unknown";

    if(error.message.includes('password'))
    errors.password = "Password does not correspond";

    return errors;
}

module.exports.uploadErrors = (err) => {
    let errors = {  format: '', maxSize: ''}
    console.log("🚀 ~ file: errors.utils.js:46 ~ err:", err)

    if(err.message.includes('invalid file'))
    errors.format = "Incompatible format";

    if(err.message.includes('max size'))
    errors.maxSize = "the file uploaded over 500ko";

    return errors;
}
