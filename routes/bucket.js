import { Router } from 'express'
const api = Router()
import Bucket from '../models/bucket'
import FileSystem from '../lib/filesystem'
import { pick } from 'lodash'

api.post('/', async (req, res) => {
  console.log('USER -->', req.user);

    try {
      const { uuid } = req.user
      const { name } = req.body

      const bucket = new Bucket({
        name,
        user_uuid: uuid
      })

      // > Before save ----- change file name
      FileSystem.createBucket(req.user, name)

      bucket.save()

      res.status(201).json({ data: { bucket }, meta: { }});
    } catch (error) {
      console.log(error);
      res.status(400).json({err: error})
    }
})

api.get('/:id', async (req, res) => {
  try {
    const bucket = await Bucket.findById(req.params.id);
    res.status(200).json({ bucket});
  } catch (err) {
    res.status(400).json({ err: `could not connect to database, err: ${err.message}` });
  }
})

api.put('/:id', async (req, res) => {
  console.log('ID', req.params.id)
  console.log('ID', req.body)
  console.log('ID', req.user)

  try {
    const bucket = await Bucket.findOne({ where: {id: req.params.id}});

    if (bucket) {
      
      const fields = pick(req.body, [
        "name"
      ]);
      
      await bucket.update(fields);
      res.status(204).send();
    }
   
  } catch (err) {
    res.status(400).json({ err: `could not connect to database, err: ${err.message}` });
  }
});

api.delete('/:id', async (req, res) => {
  try {
    const bucket = await Bucket.findOne({ where: {id: req.params.id}});

    if (bucket) {
      FileSystem.removeBucket(req.user, bucket.name)

      await bucket.destroy({
        where: {
          id: req.params.id
        }
      })
    }

    res.status(200).json({message: "User successfully Deleted"});
  } catch (err) {
    res.status(400).json({ err: `could not connect to database, err: ${err.message}` });
  }
});

api.head('/:id', async (req, res) => {
  try {
    const bucket = await Bucket.findOne({ where: {id: req.params.id}});

    if (bucket) {
      res.status(200).send()
    } else {
      res.status(400).send()
    }
  } catch (error) {
    res.status(400).json({ err: `could not connect to database, err: ${err.message}` });
  }
})

export default api;
