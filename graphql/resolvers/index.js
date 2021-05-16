const postResolver = require('./posts');
const userResolver = require('./users');
const commentsResolver = require('./comments');

module.exports = {
    Post:{
        likeCount(parent){
            return parent.likes.length;
        },
        commentCount(parent){
            return parent.comments.length;
        }
    },
    Query: {
        ...postResolver.Query
    },
    Mutation: {
        ...userResolver.Mutation,
        ...postResolver.Mutation,
        ...commentsResolver.Mutation
    },
    Subscription: {
        ...postResolver.Subscription
    }

}