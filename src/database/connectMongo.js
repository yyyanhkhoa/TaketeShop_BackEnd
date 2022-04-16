const mongoose = require("mongoose");

const { MongoClient, ServerApiVersion } = require("mongodb");
const connectString =
  "mongodb+srv://eNViDAT:Wd1vMIsQd7UNf8xp@taketemongoserver.xjdil.mongodb.net/TaketeMongoServer?retryWrites=true&w=majority";

const connect = async () => {
  mongoose
    .connect(connectString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("Chat Server connected"))
    .catch((err) => console.log(err));
};

module.exports = {connect}