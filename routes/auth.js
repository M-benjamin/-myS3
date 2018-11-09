import { Router } from 'express';
const api = Router()
import User from '../models/user'
import passport from 'passport'
import jwt from 'jsonwebtoken';
import Mail from '../lib/mail'
import FileSystem from '../lib/filesystem'

api.post('/register', async (req, res, next) => {
  const { nickname, email, password, password_confirmation } = req.body
  console.log('BODY --->', nickname);
  console.log('BODY --->', password_confirmation);
  console.log('BODY --->', password);

  try {
    
    const user = new User({
      nickname,
      email,
      password,
      password_confirmation
    })
  
    await user.save()

    FileSystem.addUserWorkspace(user)

    // console.log('USER -->' , user)

    let text = 'You are successfull register'
    Mail.send(user.email, "welcome", text, `<h1>${text}</h1>`)

    const payload = { uuid: user.uuid, nickname, email };
    const token = jwt.sign(payload, process.env.JWT_ENCRYPTION);
  
    res.status(201).json({ data: { user }, meta: { token } });
  } catch (error) {
    console.log('ERROR', error);
    res.status(400).json({err: error})
  }
})

api.post('/login', (req, res) => {
  passport.authenticate("local", {session: false}, (err, user, message) => {
    if(err) {
      res.status(400).json({err})
    }

    const {uuid, nickname, email} = user.toJSON();
    const payload = { uuid: user.uuid, nickname, email };
    const token = jwt.sign(payload, process.env.JWT_ENCRYPTION);
    res.status(200).json({ data: { user: { uuid, nickname, email } }, meta: { token } });

  })(req, res)
})

export default api