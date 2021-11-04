import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import { Strategy as JWTstrategy } from 'passport-jwt'
const ExtractJWT = require('passport-jwt').ExtractJwt

import { generateHash } from './../utils/generateHash'
import { UserModel } from './../models/UserModel'

passport.use(
  new LocalStrategy(async (username, password, done): Promise<void> => {
    try {
      const user = await UserModel.findOne({ $or: [{ email: username }, { username }] }).exec()

      if (!user) {
        return done(null, false)
      }

      if (user.password === generateHash(password + process.env.SECRET_KEY)) {
        done(null, user)
      } else {
        done(null, false)
      }
    } catch (error) {
      return done(null, false)
    }
  })
)

passport.serializeUser((user: any, done) => {
  done(null, user?._id)
})

passport.deserializeUser((id, done) => {
  UserModel.findById(id, (err: any, user: any) => {
    done(err, user)
  })
})

passport.use(
  new JWTstrategy(
    {
      secretOrKey: process.env.SECRET_KEY,
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    },
    async (payload, done) => {
      try {
        return done(null, payload.user)
      } catch (error) {
        done(error)
      }
    }
  )
)

export { passport }
