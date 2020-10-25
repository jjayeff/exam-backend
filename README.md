# Proxumer - Backend Developer Interview Question

## Quick Start

```bash
1. git clone
git clone https://github.com/jjayeff/exam-backend.git 

2. yarn or npm install

3. require('dotenv').config() in to src/index.js

4. create .env follow .env.example
*example
MONGO_DB_URL=mongodb://mongo:27017/docker-node-mongo

5. yarn start or npm start
```

Task: GraphQL-powered Chatroom

### Time limit: 3 hours

## Description

​ Please create a chatroom API using GraphQL. You may use the following schema
as your guidelines: ​

```graphql
// Message
type Message {
  id: String!
  body: String!
  image: String
  from: Sender!
}
​
type VoidResponse {
  successful: Boolean
}
​
type Query {
  messages(roomName: String!): [Message]
}
​
type Mutation {
  sendMessage(roomName: String!, message: String!): VoidResponse
}
​
type Subscription {
  newMessage(roomName: String!): Message!
}
​
// Room
type Mutation {
  createRoom(roomName: String!): VoidResponse
}
​
// Sender
type Sender {
  name: String
}
```

​ (Note: Feel free to modify/expand the schema as you see fit) ​ Requirement: ​

- You **must** utilize MongoDB for storing data, but we won't grade you on
  schema design
- You **must** include unit tests, with as much code coverage as possible (ie.
  common edge cases) ​ Evaluation: ​
- We will test your service against our MongoDB-backed mock data, so please make
  sure that your service can properly communicate with a MongoDB server
- All required features (as listed in the schema) must be bug-free
- (Bonus) build a Docker image and deploy it on Docker Hub
- (Bonus) utilize GraphQL subscription to notify users of new messages
- (Bonus) expand the service to allow an image to be sent along with the message
