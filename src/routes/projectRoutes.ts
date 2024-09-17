import { Router } from 'express'
import { body, param } from 'express-validator'
import { ProjectController } from '../controllers/ProjectController'
import { handleInputErrors } from '../middleware/validation'
import { TaskController } from '../controllers/TaskController'
import { projectExists } from '../middleware/project'
import { hasAuthorization, taskBelongsToProject, taskExists } from '../middleware/task'
import { authenticate } from '../middleware/auth'
import { TeamMemberController } from '../controllers/TeamController'
import { NoteController } from '../controllers/NoteController'

const router = Router()

//Vid 571
router.use(authenticate)

//Vid 447
router.post('/',
    //Vid 449 validaciones.
    body('projectName')
        .notEmpty().withMessage('El Nombre del Proyecto es Obligatorio'),
    body('clientName')
        .notEmpty().withMessage('El Nombre del Cliente es Obligatorio'),
    body('description')
        .notEmpty().withMessage('La Descripción del Proyecto es Obligatoria'),
    handleInputErrors,
    ProjectController.createProject
)
//Vid 447
router.get('/',  ProjectController.getAllProjects)

//Vid 451
router.get('/:id',
    param('id').isMongoId().withMessage('ID no válido'),
    handleInputErrors,
    ProjectController.getProjectById
)
//Vid 467, se ejecuta antes 

//Vid 640
router.param('projectId', projectExists)

//Vid 452, actualizar ,Vid 640 /:projectId'
router.put('/:projectId',
    param('projectId').isMongoId().withMessage('ID no válido'),
    body('projectName')
        .notEmpty().withMessage('El Nombre del Proyecto es Obligatorio'),
    body('clientName')
        .notEmpty().withMessage('El Nombre del Cliente es Obligatorio'),
    body('description')
        .notEmpty().withMessage('La Descripción del Proyecto es Obligatoria'),
    handleInputErrors,
    //Vid 640
    hasAuthorization,
    ProjectController.updateProject
)

//Vid 453 , eliminar ,Vid 640 /:projectId'
router.delete('/:projectId',
    param('projectId').isMongoId().withMessage('ID no válido'),
    handleInputErrors,
     //Vid 640
    hasAuthorization,
    ProjectController.deleteProject
)

/**************************************** Routes for tasks *****************************************/

//Vid 456
router.post('/:projectId/tasks',
    //Vid 598
    hasAuthorization,
    //Vid 462 Validaciones 
    body('name')
        .notEmpty().withMessage('El Nombre de la tarea es Obligatorio'),
    body('description')
        .notEmpty().withMessage('La descripción de la tarea es obligatoria'),
    handleInputErrors,
    TaskController.createTask
)

//Vid 463 
router.get('/:projectId/tasks',
    //Vid 463
    TaskController.getProjectTasks
)
//Vid 471
router.param('taskId', taskExists)
//VID 472
router.param('taskId', taskBelongsToProject)

//Vid 466 
router.get('/:projectId/tasks/:taskId',
    //Vid 467
    param('taskId').isMongoId().withMessage('ID no válido'),
    handleInputErrors,
    TaskController.getTaskById
)

//Vid 468 
router.put('/:projectId/tasks/:taskId',
    //Vid 598
    hasAuthorization,
    param('taskId').isMongoId().withMessage('ID no válido'),
    body('name')
        .notEmpty().withMessage('El Nombre de la tarea es Obligatorio'),
    body('description')
        .notEmpty().withMessage('La descripción de la tarea es obligatoria'),
    handleInputErrors,
    TaskController.updateTask
)

//Vid 469
router.delete('/:projectId/tasks/:taskId',
    //Vid 598
    hasAuthorization,
    param('taskId').isMongoId().withMessage('ID no válido'),
    handleInputErrors,
    TaskController.deleteTask
)
//Vid 470
router.post('/:projectId/tasks/:taskId/status', 
    param('taskId').isMongoId().withMessage('ID no válido'),
    body('status')
        .notEmpty().withMessage('El estado es obligatorio'),
    handleInputErrors,
    TaskController.updateStatus
)
/**************************************** Routes for teams**************************************/

//Vid 581 
router.post('/:projectId/team/find',
    body('email')
        .isEmail().toLowerCase().withMessage('E-mail no válido'),
    handleInputErrors,
    TeamMemberController.findMemberByEmail
)
//Vid 584
router.get('/:projectId/team',
    TeamMemberController.getProjecTeam
)

//Vid 582
router.post('/:projectId/team',
    body('id')
        .isMongoId().withMessage('ID No válido'),
    handleInputErrors,
    //Vid 582
    TeamMemberController.addMemberById
)

//Vid 593 
router.delete('/:projectId/team/:userId',
    param('userId')
        .isMongoId().withMessage('ID No válido'),
    handleInputErrors,
    TeamMemberController.removeMemberById
)

/**************************************** Routes for notes**************************************/
//Vid 607
router.post('/:projectId/tasks/:taskId/notes',
    body('content')
        .notEmpty().withMessage('El Contenido de la nota es obligatorio'),
    handleInputErrors,
    NoteController.createNote
)
//Vid 609
router.get('/:projectId/tasks/:taskId/notes',
    NoteController.getTaskNotes
)

//Vid 610
router.delete('/:projectId/tasks/:taskId/notes/:noteId',
    param('noteId').isMongoId().withMessage('ID No Válido'),
    handleInputErrors,
    NoteController.deleteNote
)

//Vid 447
export default router