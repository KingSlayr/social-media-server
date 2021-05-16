const { AuthenticationError } = require('apollo-server-errors');
const jwt = require('jsonwebtoken');
const {SECRET_KEY} = require('../../../config');

module.exports = (context) => {
    const authHeader = context.req.headers.authorization;
    if(authHeader){
        const token = authHeader.split('Bearer ')[1];
        if(token){
            try{
                const user = jwt.verify(token,SECRET_KEY);
                return user;
            }catch(err){
                throw new AuthenticationError('Invalid/expired token')
            }
        }
        throw new Error('Authtnetication token must be \'Bearer [token]')
    }
    throw new Error('Authtnetication header must be provided')
}