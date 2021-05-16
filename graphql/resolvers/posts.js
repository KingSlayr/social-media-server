const { AuthenticationError, UserInputError } = require('apollo-server-errors');
const Post = require('../../models/Posts');
const checkAuth = require('../resolvers/utils/check-auth');

module.exports =  {
        Query: {
            async getPosts(){
                try{
                    const Posts = await Post.find().sort({createdAt:1});
                    return Posts;
                }catch(err){
                    throw new Error(err);
                }
            },

            async getPost(_,{postID}){
                try{
                    // console.log(postID);
                    const post = await Post.findById(postID);
                    if(post){
                        return post;
                    }else{
                        // console.log('1');
                        throw new Error('post not found');
                    }
                }catch(error){
                    // console.log('2');
                    throw new Error(error);
                }
            }
        },
        Mutation: {
            async createPost(_,{body},context){

                const user = checkAuth(context);

		if(body.trim()===''){
			throw new Error('Post body should not be empty')
		}

                const newPost = new Post({
                    body,
                    user:user.id,
                    username:user.username,
                    createdAt: new Date().toISOString()
                })

                const post = await newPost.save();

                context.pubsub.publish('NEW_POST',{
                    newPost:post
                })
                return post;
            },

            async deletePost(_,{postID},context){
                const user = checkAuth(context);
                try{
                    const post = await Post.findById(postID);
                    if(user.username === post.username){
                        await post.delete();
                        return "Post deleted succesfully"
                    }else{
                        throw new AuthenticationError("Action not Allowed");
                    }
                }catch(err){
                    throw new Error(err); 
                }
            }
        },

        Subscription:{
            newPost:{
                subscribe: (_,__,{pubsub}) => pubsub.asyncIterator("NEW_POST")  
            }
        }
}
