import { Router } from 'express';
const api = Router()
import User from '../models/user'

api.get('/', async (req, res) => {
  try {
    const users = await User.findAll()
    return res.status(200).json({ data: { users: users }})
  } catch (error) {
    res.status(400).json({err: error.messages})
  }
})

api.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json({ user });
  } catch (err) {
    res.status(400).json({ err: `could not connect to database, err: ${err.message}` });
  }
});

export default api;