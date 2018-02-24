// This is the API model for users.
import mongoose from "mongoose";
import bcrypt from "bcrypt";

var passportLocalMongoose = require('passport-local-mongoose');
const murSchema = require('./mur').schema;
const shareSchema = require('./share').schema;

let userSchema = mongoose.Schema({
  id: {
    type: Number,
  },
  username: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  rumBalance: {
    type: Number,
    required: false
  },
  ownedShare: {
    type: Array,
    required: false
  },
})

userSchema.plugin(passportLocalMongoose);
let User = module.exports = mongoose.model('userSchema', userSchema);
let Share = mongoose.model('Share', shareSchema);

// GET ALL THE USERS
module.exports.getAllUsers = (callback) => {
  User.find(callback);
}

//GET A SPECIFIC USER
module.exports.getUser = (id, res, callback) => {
  User.findById(id, function (err, user) {
    if(!user) {
      res.send("no user with this id");
    }
    res.json(user);
  });
}

//GET A STORE A SHARE USER
module.exports.storeShare = (id, shareId, sharePrice, res, req, callback) => {
  User.findById(id, function(err, user) {
    user.ownedShare.push(shareId);
    user.rumBalance -= sharePrice;
    user.save();
    req.session.user = user;
    res.status(200).send('you have bought a new share !!');
  });
};

// TOP UP SOME TOKEN
module.exports.topUp = (id, amount, res, req, callback) => {
  User.findById(id, function(err, user) {
    user.rumBalance += amount;
    user.save();
    req.session.user = user;
    res.status(200).send(user);
  });
};

// TOP UP SOME TOKEN
module.exports.sellShare = (userId, shareId, res, req, callback) => {
  Share.findById(shareId, function(err, share) {
    share.owned = "sold";
    share.save();
    User.findById(userId, function(err, user) {
      user.rumBalance -= share.price;
      user.save();

    })
  });
  /// SHARE STATUS TO SOLD
  /// REMOVE SHARE PRICE TO THE USER BALANCE
};
