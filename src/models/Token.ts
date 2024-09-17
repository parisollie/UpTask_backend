import mongoose, { Schema, Document, Types } from "mongoose" 

//Vid 534
export interface IToken extends Document {
    token: string
    user: Types.ObjectId
    createdAt: Date
}
//Vid 534
const tokenSchema : Schema = new Schema({
    token: {
        type: String,
        required: true
    },
    user: {
        type: Types.ObjectId,
        ref: 'User'
    },
    expiresAt: {
        type: Date,
        default: Date.now(),
        //Tiene 10 min para aceptar el token
        expires: '10m'
    }
})

const Token = mongoose.model<IToken>('Token', tokenSchema)
export default Token