import express from 'express';
import mLog from './lib/utils'
import {db as database} from './models'
import routes from './routes'
import passport from 'passport'
import bodyParser from 'body-parser'
const port = parseInt(process.argv[2], 10) || process.env.PORT;
const app = express();

import './middlewares/passport'

app.use(passport.initialize());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

const start = async () => {
  try {
    await database.authenticate();
    if (process.env.APP === 'development') {
      database.sync({force: process.env.DATABASE_SYNC_FORCE});
    }
    
    app.use('/api', routes)

    app.listen(port, (err) => {
      if (err) {
        throw err;
      } else {
        mLog(`Server is running on port ${port}`, 'cyan');
      }
    });
  } catch (e) {}
}

start()
