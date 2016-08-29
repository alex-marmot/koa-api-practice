import jwt from 'jsonwebtoken';
import User from '../models/user';
import passport from 'koa-passport';
import config from '../config/jwtConfig';
import passportService from '../config/passport';

function generateToken(user) {
  return jwt.sign(user, config.secret, {
    expiresIn: 10080 // in seconds
  });
}

// Login Route
exports.login = async function(ctx, next) {
  // console.log(ctx.request.body)
  let middleware = passport.authenticate('jwt', {
    session: false }, async(user, info) => {
    if (err) { return next(err) }
    if (!user) { return res.status(401).json( { error: info.error }) }
    return res.json({
      token: 'JWT ' + generateToken(user),
      user: { name: user.username, email: user.email, id: user._id, avatar: user.avatar }
    });
    })
    await middleware.call(this, ctx, next)
}

// Registration Route
exports.register = function(ctx, next) {
  // Check for registration errors
  const username = ctx.request.body.username;
  const email = ctx.request.body.email;
  const password = ctx.request.body.password;

  User.findOne({ username: username }, function(err, existingUser) {
      if (err) { return next(err); }

      // If user is not unique, return error
      if (existingUser) {
        return ctx.body({ error: '用户名已被注册', status: 422 });
      }

      // If username is unique and password was provided, create account
      const user = new User({
        email: email,
        username: username,
        password: password
      });

      user.save(function(err) {
        if (err) { return next(err); }
        return ctx.body({
          token: 'JWT ' + generateToken(user),
          user: { name: user.username, email: user.email, id: user._id}
        });
      });
  });
}
