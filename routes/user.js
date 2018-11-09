import { Router } from 'express';
const api = Router()
import User from '../models/user'
import { pick } from 'lodash'

api.get('/', async (req, res) => {
  try {
    const users = await User.findAll()
    return res.status(200).json({ data: { users: users }})
  } catch (error) {
    res.status(400).json({err: error.messages})
  }
})

api.get('/:uuid', async (req, res) => {
  try {
    const user = await User.findById(req.params.uuid);
    res.status(200).json({ user });
  } catch (err) {
    res.status(400).json({ err: `could not connect to database, err: ${err.message}` });
  }
});

api.put('/:uuid', async (req, res) => {
  console.log('ID', req.params.uuid)
  console.log('ID', req.body)
  console.log('ID', req.user)

  try {
    const user = await User.findOne({ where: {uuid: req.params.uuid}});

    if (user) {
      const fields = pick(req.body, [
        "nickname",
        "password",
        "password_confirmation",
        "email"
      ]);
      
      await user.update(fields);
      res.status(204).send();
    }
   
  } catch (err) {
    res.status(400).json({ err: `could not connect to database, err: ${err.message}` });
  }
});

api.delete('/:uuid', async (req, res) => {
  try {
    const user = await User.findOne({ where: {uuid: req.params.uuid}});

    if (user) {
      await User.destroy({
        where: {
          uuid: req.params.uuid
        }
      })
    }
    res.status(200).json({message: "User successfully Deleted"});
  } catch (err) {
    res.status(400).json({ err: `could not connect to database, err: ${err.message}` });
  }
});

export default api;