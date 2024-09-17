import mongoose, { Schema, Document, Types } from 'mongoose'

//Vid 606
export interface INote extends Document {
    content: string
    createdBy: Types.ObjectId
    task: Types.ObjectId
}
//Vid 606
const NoteSchema: Schema = new Schema({
    content: {
        type: String,
        required: true
    },
    createdBy: {
        type: Types.ObjectId,
        ref: 'User',
        required: true
    },
    task: {
        type: Types.ObjectId,
        ref: 'Task',
        required: true
    }
}, {timestamps: true})

//Vid 606
const Note = mongoose.model<INote>('Note', NoteSchema)
export default Note