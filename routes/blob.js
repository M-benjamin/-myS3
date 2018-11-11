import { Router } from 'express'
const api = Router({ mergeParams: true})
import multer from 'multer'
import Bucket from '../models/bucket'
import Blob from '../models/blob'
import { pick } from 'lodash' 
import FileSystem from '../lib/filesystem'

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const { name } = await Bucket.findById(req.params.id)
    cb(null, `/opt/workspace/myS3/${req.params.uuid}/${name}`)
  },
  filename: (req, file, cb) => {
    let extension = file.mimetype.split('/')[1]
    cb(null, `${file.fieldname}-${Date.now()}.${extension}`)
  }
})

const upload = multer({ storage: storage })

api.post('/', upload.single('image'), async (req, res)  => {
    try {
      const { filename, path, size, mimetype} = req.file
      const { id } = await Bucket.findById(req.params.id)

      const blob = new Blob({
        filename,
        path,
        size,
        bucket_id: id
      })

      blob.save()

      res.status(201).json({ data: { blob }, meta: { size, mimetype}});
    } catch (error) {
      res.status(400).json({err: error});
    } 
})

api.get('/:id', async (req, res)  => {
  try {
    const blob = await Blob.findById(req.params.id);
    res.status(200).json({blob});
  } catch (err) {
    res.status(400).json({ err: `could not connect to database, err: ${err.message}` });
  }
})

api.put('/:blobId', upload.single('image'), async (req, res)  => {
  try {
    const blob = await Blob.findOne({ where: {id: req.params.blobId}});

    if (blob) {
      const fields = pick(req.file, [
        "filename",
        "path",
        "size"
      ]);
      
      await blob.update(fields);
      res.status(204).send();
    }
   
  } catch (err) {
    res.status(400).json({ err: `could not connect to database, err: ${err.message}` });
  }
})

api.delete('/:blobId', async (req, res)  => {
  try {
    const blob = await Blob.findOne({ where: {id: req.params.blobId}});

    if (blob) {    
      FileSystem.removeBlob(blob.path)

      await blob.destroy({
        where: {
          id: req.params.blobId
        }});

      res.status(204).send();
    }
   
  } catch (err) {
    res.status(400).json({ err: `could not connect to database, err: ${err.message}` });
  }
})

api.post('/:blobId/copy', async (req, res) => {
  try {
    const blob = await Blob.findById(req.params.blobId)
    if (blob) {
      FileSystem.copyBlob(blob.path, blob.filename)
      res.status(204).json()
    }
  } catch (error) {
      res.status(400).json({err: error})
  }
})

export default api;
