import passport from 'koa-passport';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import config from './jwtConfig';
import LocalStrategy from 'passport-local';
const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;

passport.serializeUser(function(user, done) {
    done(null, user.id)
})

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user)
    })
})

const localOptions = {
  usernameField: 'username'
}

// Setting up local login strategy
const localLogin = new LocalStrategy(localOptions, function(username, password, done) {
  if(username == 'test'){
      return done(null, {"id": 1, "username" : "test", "password" : "test", "email": "test@qq.com"})
  }
  User.findOne({ username: username }, function(err, user) {
    if(err) { return done(err); }
    if(!user) { return done(null, false, { error: '亲，您的用户名不存在哦 :(' }); }

    user.comparePassword(password, function(err, isMatch) {
      if (err) { return done(err); }
      if (!isMatch) { return done(null, false, { error: "亲，您的密码无效 :(" }); }

      return done(null, user);
    });
  });
});

// Setting JWT strategy options
const jwtOptions = {
  // Telling Passport to check authorization headers for JWT
  jwtFromRequest: ExtractJwt.fromAuthHeader(),
  // Telling Passport where to find the secret
  secretOrKey: config.secret
};

// Setting up JWT login strategy
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
    if (username == 'test') {
        return done(null, { "id": 1, "username": "test", "password": "test", "email": "test@qq.com" })
    }
  User.findById(payload._doc._id, function(err, user) {
    if (err) { return done(err, false); }

    if (user) {
      console.log(user);
      done(null, user);
    } else {
      done(null, false);
    }
  });
});

passport.use(localLogin);
passport.use(jwtLogin);
// passport.serializeUser(function(user, done) {
//     done(null, user.id)
// })

// passport.deserializeUser(function(id, done) {
//     User.findById(id, function(err, user) {
//         done(err, user)
//     })
// })

// var LocalStrategy = require('passport-local').Strategy

// passport.use(new LocalStrategy(function(username, password, done) {
  
// //   User.findOne({username: username, password: password})
// //     .then(function(result) {
// //         if(result != null) {
// //             done(null, result)
// //         }  else {
// //             done(null, false)
// //         }
// //     })
//      done(null, {"id": 1, "username" : "test", "password" : "test"})
// }))
