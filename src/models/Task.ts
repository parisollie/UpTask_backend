import mongoose, {Schema, Document, Types} from 'mongoose'
import Note from './Note'

//Vid 456
const taskStatus = {
    PENDING: 'pending',
    ON_HOLD: 'onHold',
    IN_PROGRESS: 'inProgress',
    UNDER_REVIEW: 'underReview',
    COMPLETED: 'completed'
} as const

//Vid 456
export type TaskStatus = typeof taskStatus[keyof typeof taskStatus]

//Vid 454
export interface ITask extends Document {
    name: string
    description: string
    //Vid 455
    project: Types.ObjectId
    //Vid 456
    status: TaskStatus
    //Vid 600
    completedBy: {
        //Vid 604
        user: Types.ObjectId,
        status: TaskStatus
    }[]
    //Vid 608
    notes: Types.ObjectId[]
}
//Vid 454
export const TaskSchema : Schema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    description: {
        type: String,
        trim: true,
        required: true
    },
    //Vid 455
    project: {
        type: Types.ObjectId,
        ref: 'Project'
    },
    //Vid 456
    status: {
        type: String,
        enum: Object.values(taskStatus),
        default: taskStatus.PENDING
    },
    //Vid 600 
    completedBy: [
        {
            //Vid 604
            user: {
                type: Types.ObjectId,
                ref: 'User',
                default: null
            },
            status: {
                type: String,
                enum: Object.values(taskStatus),
                default: taskStatus.PENDING
            }
        }
    ],
    //Vid 608
    notes: [
        {
            type: Types.ObjectId,
            ref: 'Note'
        }
    ]
}, {timestamps: true})//Vid 455

//Vid 641,Middleware
TaskSchema.pre('deleteOne', {document: true}, async function() {
    const taskId = this._id
    if(!taskId) return
    await Note.deleteMany({task: taskId})
})

//Vid 454
const Task = mongoose.model<ITask>('Task', TaskSchema)
export default Task