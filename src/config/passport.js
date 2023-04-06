import passport from "passport";
import {Strategy as LocalStrategy} from "passport-local";

import { User } from "../dao/model/users.js";


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
    done(null, user.id)
};

export const deserializeUser = (id, done) => {
    User.findById(id, (err, user) => {
        done(err, user)
    });
};


export default passport;
