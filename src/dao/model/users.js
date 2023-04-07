import { Schema, model } from "mongoose";
import bcrypt from 'bcrypt'


const UserSchema =  Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    email: {
        type: String,
        required: [true, 'El email es obligatorio']
    },
    password: {
        type: String
    }
})

UserSchema.methods.encryptPassword = async (password) => {

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;

}


UserSchema.methods.matchPassword = async function (password){
    return await bcrypt.compare(password, this.password);
}

export const User = model('User', UserSchema)