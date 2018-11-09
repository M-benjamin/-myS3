import fs from 'fs'
import path from 'path'

class FileSystem {
  constructor() {
    if(!FileSystem.instance) {
      this.initialize()
    } 
  }

  initialize() {

  }

  addUserWorkspace(user) {
    // console.log('USER --> FILESYSTEM', user)
    const dir = path.join(`/opt/workspace/myS3/${user.uuid}`)
    
    if (!fs.existsSync(dir)){
      fs.mkdirSync(dir)
      fs.chmodSync(dir, '777')
    }
  }

  createBucket(user, worckspace) {
    console.log("DATA:::", user, worckspace);

    const dir = path.join(`/opt/workspace/myS3/${user.uuid}/${worckspace}`)
    
    if (!fs.existsSync(dir)){
      fs.mkdirSync(dir)
      fs.chmodSync(dir, '777')
    } else {
      throw new Error("Buchet already exist")
    }
  }

  createBucket(user, worckspace) {
    const dir = path.join(`/opt/workspace/myS3/${user.uuid}/${worckspace}`)
    
    if (!fs.existsSync(dir)){
      fs.mkdirSync(dir)
      fs.chmodSync(dir, '777')
    } else {
      throw new Error("Buchet already exist")
    }
  }

  removeBucket(user, bucketName) {
    const dir = path.join(`/opt/workspace/myS3/${user.uuid}/${bucketName}`)

    if (fs.existsSync(dir)){
      fs.rmdirSync(dir)
    } else {
      throw new Error("Can not delete Bucket")
    }
  
  }

  createBlob(user, bucketName, blobName) {}
  removeBlob(user, bucketName, blobName) {}
}

const instance = new FileSystem()
Object.freeze(instance);
export default instance;