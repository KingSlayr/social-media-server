module.exports.validateRegisterInput = (
    username,
    email,
    password,
    confirmPassword
) => {
    const error={};
    if(username.trim()===""){
        error.username = 'username must not be empty'
    }
    if(username.trim()===""){
        error.email = 'email must not be empty'
    }else {
        // /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
        const regEx=/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        if(!email.match(regEx)){
            error.email = 'invalid email'
        }
    }
    if(password.trim()===""){
        error.username = 'password must not be empty'
    }else if(password!==confirmPassword){
        error.confirmPassword='Password must match'
    }

    return{
        error,
        valid:Object.keys(error).length<1
    }

}

module.exports.validateLoginInput = (username,password) => {
    const error = {};
    if(username.trim()===""){
        error.username = 'username must not be empty'
    }
    if(password.trim()===""){
        error.username = 'password must not be empty'
    }

    return{
        error,
        valid:Object.keys(error).length<1
    }
}