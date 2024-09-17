import mongoose, {Schema, Document, PopulatedDoc, Types} from 'mongoose'
import Task, { ITask } from './Task'
import { IUser } from './User'
import Note from './Note'

//Vid 445
//Vid 454  Interface
export interface IProject extends Document {
    //Vid 445
    projectName: string
    clientName: string
    description: string
    //Vid 455
    tasks: PopulatedDoc<ITask & Document>[]
    //Vid 568
    manager: PopulatedDoc<IUser & Document>
    //Vid 580
    team: PopulatedDoc<IUser & Document>[]
}

//Vid 445, es de Moongese
const ProjectSchema: Schema = new Schema({
    projectName: {
        type: String,
        required: true,
        trim: true
    },
    clientName: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    //Vid 455
    tasks: [
        {
            type: Types.ObjectId,
            ref: 'Task'
        }
    ],
    //Vid 568
    manager: {
        type: Types.ObjectId,
        ref: 'User'
    },
    //Vid 580
    team: [
        {
            type: Types.ObjectId,
            ref: 'User'
        }
    ],
}, {timestamps: true})//Vid 455

//VId 642,Middlewares
ProjectSchema.pre('deleteOne', {document: true}, async function() {
    const projectId = this._id
    if(!projectId) return

    const tasks = await Task.find({ project: projectId })
    for(const task of tasks) {
        await Note.deleteMany({ task: task.id})
    }

    await Task.deleteMany({project: projectId})
})

//Vid 445
const Project = mongoose.model<IProject>('Project', ProjectSchema)
export default Project