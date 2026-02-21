import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { getUserById} from "../../controllers/userController";
import { PassportStrategy } from '../../interfaces/index';
import { userModel } from "../../models/userModel";

const localStrategy = new LocalStrategy(
  {
    usernameField: "email",
    passwordField: "password",
  },
  (email: string, password: string, done: any) => {
    const user = userModel.findOne(email)
    if(!user){
      return done(null, false, { message: "User does not exist" })
    }
    const isPasswordValid = user.password === password;
    if (!isPasswordValid) {
      return done(null, false, { message: "Incorrect password" });
    }
    return done(null, user);
  }
);

/*
FIX ME (types) 😭 ✅
*/
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

/*
FIX ME (types) 😭
*/
passport.deserializeUser(function (id: number, done) {
  let user = getUserById(id);
  if (user) {
    done(null, user);
  } else {
    done({ message: "User not found" }, null);
  }
});

const passportLocalStrategy: PassportStrategy = {
  name: 'local',
  strategy: localStrategy,
};

export default passportLocalStrategy;
