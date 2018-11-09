import Sequelize from 'sequelize'
import User from './user'
import Bucket from './bucket'
import Blob from './blob'
import dotenv from 'dotenv'

dotenv.config()

export const db = new Sequelize(process.env.DATABSE_URL, {
  // operatorsAliiases: Op,
  define: {
    underscored: true
  }
});

// > Initialize tables
User.init(db, Sequelize);
Bucket.init(db, Sequelize);
Blob.init(db, Sequelize);

// > RELATION USER ::: BUCKET
// ------------------------------------------
User.hasMany(Bucket);

Bucket.belongsTo(User, { 
  constraints: false,
});

// > RELATION BUCKET ::: BLOB
// -------------------------------------------
Bucket.hasMany(Blob);

Blob.belongsTo(Bucket, { 
  constraints: false,
});
