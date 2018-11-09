
import { Router } from 'express';
const api = Router()
import users from './user'
import auth from './auth'
import Mail from "../lib/mail"

api.get('/', (req, res, next) => {
  res.json({hello: 'Hello'})
  // Mail.send("ben@mailinator.com", "welcome")
  next()
})

api.use('/users', users)
api.use('/auth', auth)

export default api;