const { UserInputError, AuthenticationError } = require('apollo-server-errors');
const Post = require('../../models/Posts');
const checkAuth = require('./utils/check-auth');

module.exports = {
    Mutation:{
        async createComment(_,{postID,body},context){
            const {username} = checkAuth(context);
            if(body.trim()===''){
                throw new UserInputError("Empty Comment",{
                    errors:{
                        body:'comment body must not be empty'
                    }
                });
            }
            const post = await Post.findById(postID);
            if(post){
                post.comments.unshift({
                    body,
                    username,
                    createdAt:new Date().toISOString()
                })
                await post.save();
                return post;
            }else throw new UserInputError('Post not found');
        },

        async deleteComment(_,{postID,commentID},context){
            const {username} = checkAuth(context);

            const post = await Post.findById(postID);
            if(post){
                const commentIndex = post.comments.findIndex(c=>c.id===commentID);
                if(post.comments[commentIndex].username === username){
                    post.comments.splice(commentIndex,1);
                    await post.save();
                    return post; 
                }else{
                    throw new AuthenticationError('Action not allowed');
                }
            }else throw new UserInputError('post not found');
        },

        async likePost(_,{postID},context){
            const {username} = checkAuth(context);
            const post = await Post.findById(postID);

            if(post){
                if(post.likes.find(like => like.username === username)){
                    //post already liked
                    post.likes = post.likes.filter(like => like.username !== username);
                }else{
                    //not liked
                    post.likes.push({
                        username,
                        createdAt: new Date().toISOString()
                    })
                }
                await post.save();
                return post;
            }else throw new UserInputError('post not found')
        }
    }
}