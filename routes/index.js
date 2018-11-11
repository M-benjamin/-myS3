
import { Router } from 'express';
const api = Router()
import users from './user'
import buckets from './bucket'
import blobs from './blob'
import auth from './auth'
import Mail from "../lib/mail"
import passport from "passport"

api.get('/', (req, res, next) => {
  res.json({hello: 'Hello'})
  // Mail.send("ben@mailinator.com", "welcome")
  next()
})

api.use('/users',passport.authenticate("jwt", {session: false}) ,users)
api.use('/users/:uuid/buckets', passport.authenticate("jwt", {session: false}) , buckets)
api.use('/users/:uuid/buckets/:id/blob', passport.authenticate("jwt", {session: false}) , blobs)
api.use('/auth', auth)

export default api;