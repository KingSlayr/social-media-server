const Users = require('../../models/Users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {UserInputError} = require('apollo-server');

const {validateRegisterInput,validateLoginInput} = require('../resolvers/utils/validators');

const{SECRET_KEY} = require('../../config');

function generateToken(res){
    return jwt.sign({
        id:res.id,
        username:res.username,
        email:res.email
    },SECRET_KEY,{expiresIn:'1h'});
}

module.exports = {
    Mutation:{
        async login(_,{username,password}){
            const {valid , error} = validateLoginInput(username,password);
            if(!valid){
                throw new UserInputError('Errors',{error})
            }
            const user = await Users.findOne({username});
            if(!user){
                error.general = 'user not found';
                throw new UserInputError('Wrong Credentials',{error});
            }

            const match =  await bcrypt.compare(password,user.password);
            if(!match){
                error.general = 'user not found';
                throw new UserInputError('Wrong Credentials',{error});
            }

            const token = generateToken(user);
            return{
                ...user._doc,
                id:user._id,
                token
            }

        },
        async register(
            _,
            {registerInput: {username,email,password,confirmPassword}}, 
            ){
                const {valid , error} = validateRegisterInput(username,email,password,confirmPassword);
                if(!valid){
                    throw new UserInputError('Errors',{error})
                }

                const user = await Users.findOne({username});
                const checkEmail = await Users.findOne({email});
                if(user){
                    throw new UserInputError("Username Taken!",{
                        errors:{
                            username:'username is already taken'
                        }
                    })
                }else if(checkEmail){
                    throw new UserInputError("Email Taken!",{
                        errors:{
                            email:'email is already taken'
                        }
                    })
                }
                if(password!==confirmPassword){
                    throw new UserInputError("Password mismatch",{
                        errors:{
                            password:'mismatch'
                        }
                    })
                }
                password = await bcrypt.hash(password,12);

                const newUser = new Users({
                    email,
                    username,
                    password,
                    createdAt : new Date().toISOString()
                });

                const res = await newUser.save();

                const token = generateToken(res)

                return{
                    ...res._doc,
                    id:res._id,
                    token
                }
            }
    }
}