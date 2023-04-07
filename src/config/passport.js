import passport from "passport";
import {Strategy as LocalStrategy} from "passport-local";
import GithubStrategy from "passport-github2" 
import { config } from "dotenv";
config();
import { User } from "../dao/model/users.js";


passport.use('github', new GithubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: 'http://localhost:8080/auth/github/callback'
}, async(accessToken, refreshToken, profile, done) => {
    try{
        const user = await User.findOne({email: profile._json.email});
        if(!user){
            const nuevoUsuario = {
                name: profile._json.name,
                email: profile._json.email,
            }
            const result = await User.create(nuevoUsuario)
            done(null, result)
        }else{
            done(null, user)
        }

    }catch(error){
        done(error)
    }
}));

export const localStrategy = new LocalStrategy({
    usernameField: 'email',

}, async(email, password, done) => {
console.log(`Local strategy`, email, password);
    const user = await User.findOne({email: email});
    if(!user){ 
        console.log(`User not found`);
        return done(null, false, {message: 'Usuario no encontrado'});
    }else{
        const match = await user.matchPassword(password);
        if(match){
            console.log(`Password matched`);
            return done(null, user)
        }else{
            console.log(`Password not matched`);
            return done(null, false, {message: 'Password incorrecto'})
        }
    }

});







export const serializeUser = (user, done) => {
    done(null, user._id)
};

export const deserializeUser = (id, done) => {
    User.findById(id, (err, user) => {
        done(err, user)
    });
};


export default passport;
