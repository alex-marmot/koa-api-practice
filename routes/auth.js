import Router from 'koa-router';
import passport from 'koa-passport';
import passportService from '../config/passport';
import User from '../models/user';
import jwt from 'jsonwebtoken';
import config from '../config/jwtConfig';


function generateToken(user) {
  return jwt.sign(user, config.secret, {
    expiresIn: 10080 // in seconds
  });
}

const auth = new Router(
  {
    prefix: '/auth'
  });

auth.post('/login', async (ctx, next) => {
    let middleware = passport.authenticate('local', {
        session: false
    }, async (user, info) => {
        if (user === false) {
            ctx.body = {
                'status': 400,
                'error': info.error
            }
        } else {
            await ctx.login(user)
            ctx.body = {
                user: user,
                token: 'JWT ' + generateToken(user),
            }
        }
    })
    await middleware.call(this, ctx, next)
})

auth.get('/logout', async (ctx, next) => {
    ctx.logout()
    ctx.redirect('/')
})

auth.post('/register', async (ctx, next) => {
    const username = ctx.request.body.username;
    const email = ctx.request.body.email;
    const password = ctx.request.body.password;
    User.findOne({ username: username }).then(function () {
        const user = new User({
            email: email,
            username: username,
            password: password
        });

        user.save()
            .then(function () {
                console.log('saved')
            }, function (err) {
                console.log('Ops Somethng went wrong when save user.')
            });
        }, function (err) {
            console.log('Ops Somethng went wrong.')
        });;
})


export default auth;
