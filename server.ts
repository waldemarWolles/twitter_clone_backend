import dotenv = require('dotenv')
dotenv.config()

import express = require('express')

require('./core/db')

import { registerValidations } from './validations/register'
import { UserCtrl } from './controllers/UserController'

import { passport } from './core/passport'
const app = express()

app.use(express.json())
app.use(passport.initialize())

app.get('/users', UserCtrl.index)
app.get('/users/me', passport.authenticate('jwt'), UserCtrl.getUserInfo)
app.get('/users/:id', UserCtrl.show)
app.get('/auth/verify', registerValidations, UserCtrl.verify)
app.post('/auth/register', registerValidations, UserCtrl.create)
app.post('/auth/login', passport.authenticate('local'), UserCtrl.afterLogin)
// app.patch('/users', UserCtrl.update)
// app.delete('/users', UserCtrl.delete)

app.listen(process.env.PORT, (): void => {
  console.log('Server runned!')
})
