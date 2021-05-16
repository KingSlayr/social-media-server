const {ApolloServer,PubSub} = require('apollo-server');
const mongoose = require('mongoose');

const pubsub = new PubSub();

const PORT = process.env.PORT || 5000
const {MongoDb} = require('./config.js');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({req}) => ({req,pubsub})
});

mongoose.connect(MongoDb,{useNewUrlParser:true})
    .then(()=>{
        console.log('MongoDb connected!');
        return server.listen({port:PORT})
    })
    .then(res=>{
        console.log(`Server running at ${res.url}`);
    })
    .catch(err=> console.error(err))

