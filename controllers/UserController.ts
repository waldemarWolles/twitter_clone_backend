import express = require('express')
import jwt from 'jsonwebtoken'
import { validationResult } from 'express-validator'
import mongoose from 'mongoose'
import { UserModelDocumentInterface, UserModel, UserModelInterface } from '../models/UserModel'
import { generateHash } from '../utils/generateHash'
import { sendEmail } from '../utils/sendEmail'
import { isValidObjectId } from '../utils/isValidObjectId'

class UserController {
  async index(_: any, res: express.Response): Promise<void> {
    try {
      const users = await UserModel.find({}).exec()

      res.json({
        status: 'success',
        data: users,
      })
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error,
      })
    }
  }

  async show(req: any, res: express.Response): Promise<void> {
    try {
      const userId = req.params.id

      if (!isValidObjectId(userId)) {
        res.status(400).send()
        return
      }
      const user = await UserModel.findById(userId).exec()

      if (!user) {
        res.status(404).send()
        return
      }


      res.json({
        status: 'success',
        data: user,
      })
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error,
      })
    }
  }

  async create(req: express.Request, res: express.Response): Promise<void> {
    try {
      const errors = validationResult(req)

      if (!errors.isEmpty()) {
        res.status(400).json({ status: 'error', errors: errors.array() })
        return
      }

      const data: UserModelInterface = {
        email: req.body.email,
        fullname: req.body.fullname,
        username: req.body.username,
        password: generateHash(req.body.password + process.env.SECRET_KEY),
        confirmedHash: generateHash(process.env.SECRET_KEY || Math.random().toString()),
      }

      const user = await UserModel.create(data)

      sendEmail({
        emailFrom: 'admin@twitter.com',
        emailTo: data.email,
        subject: 'Twitter Clone Confirmatioin Email',
        html: `For confirmation go to <a href="http://localhost:${process.env.PORT || 8888}/auth/verify?hash=${
          data.confirmedHash
        }">this link</a>`,
        callback: function (err: Error | null) {
          if (err) {
            res.json({
              status: 'error',
              message: err,
            })
          } else {
            res.json({
              status: 'success',
              data: user,
            })
          }
        },
      })
    } catch (error) {
      res.status(201).json({
        status: 'error',
        message: error,
      })
    }
  }

  async verify(req: any, res: express.Response): Promise<void> {
    try {
      const hash = req.query.hash

      if (!hash) {
        res.status(400).send()
        return
      }

      const user = await UserModel.findOne({ confirmedHash: hash }).exec()

      if (user) {
        user.confirmed = true
        user.save()

        res.json({
          status: 'success',
        })
      } else {
        res.status(404).json({ status: 'error', message: 'User not found' })
      }
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error,
      })
    }
  }

  async afterLogin(req: any, res: express.Response): Promise<void> {
    try {
      const user = req.user ? (req.user as UserModelDocumentInterface).toJSON() : undefined

      res.json({
        status: 'success',
        data: { ...user, token: jwt.sign({ ...req.user }, process.env.SECRET_KEY || 'test12345', { expiresIn: '30d' }) },
      })
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error,
      })
    }
  }

  async getUserInfo(req: any, res: express.Response): Promise<void> {
    try {
      const user = req.user ? (req.user as UserModelDocumentInterface).toJSON() : undefined

      res.json({
        status: 'success',
        data: user,
      })
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error,
      })
    }
  }
}

export const UserCtrl = new UserController()
