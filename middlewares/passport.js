import passport from 'passport'
import { Strategy as LocalStrategy} from 'passport-local'
import { Strategy as JsonWebTokenStrategy, ExtractJwt } from 'passport-jwt';
import User from '../models/user'

passport.use(new LocalStrategy({
  usernameField: "nickname", 
  passwordField: "password"
},
  async (nickname, password, done) => {
    try {
      const user = await User.findOne({ where: {
        nickname
      }})
  
      if(!user) {
        return done('Please check your nickname') 
      }
  
      if (!(await user.checkPassword(password))) {
        return done('Incorrect Password')
      }
  
      done(false, user)
  
    } catch (error) {
      done(`Something does not work : ${error}`)
    }
  })
)

passport.use(
  new JsonWebTokenStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_ENCRYPTION,
    },
    async (jwtPayload, done) => {
      try {
        const user = await User.findOne({ where: { uuid: jwtPayload.uuid } });

        if (user) {
          done(null, user);
        }
      } catch (err) {
        done(err);
      }
    },
  ),
);
