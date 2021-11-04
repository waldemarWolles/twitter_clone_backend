import express = require('express')
import mongoose from 'mongoose'
import { validationResult } from 'express-validator'

import { TweetModel } from './../models/TweetModel'
import { isValidObjectId } from '../utils/isValidObjectId'

class UserController {
  async index(_: any, res: express.Response): Promise<void> {
    try {
      const tweets = await TweetModel.find({}).exec()

      res.json({
        status: 'success',
        data: tweets,
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
      const tweetId = req.params.id

      if (!isValidObjectId(tweetId)) {
        res.status(400).send()
        return
      }

      const tweet = await TweetModel.findById(tweetId).exec()

      if (!tweet) {
        res.status(404).send()
        return
      }

      res.json({
        status: 'success',
        data: tweet,
      })
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error,
      })
    }
  }

  async create(req: express.Request, res: express.Response): Promise<void> {}

  async delete(req: express.Request, res: express.Response): Promise<void> {}
}

export const UserCtrl = new UserController()
