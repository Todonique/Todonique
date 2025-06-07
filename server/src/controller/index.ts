import { registerHandler, loginHandler, setupTwoFactorAuthenticationHandler, verifyTwoFactorHandler } from './authController';
import { createTodoHandler, updateTodoHandler, getTodosByUserInTeamHandler } from './todoController';
import {createTeamHandler, updateTeamHandler, deleteTeamHandler, getTeamsForTodoUserHandler, insertTeamMemberHandler, getTeamMembersHandler} from './teamController';

export { registerHandler, loginHandler, setupTwoFactorAuthenticationHandler, verifyTwoFactorHandler, 
    createTodoHandler, updateTodoHandler, getTodosByUserInTeamHandler,
    createTeamHandler, updateTeamHandler, deleteTeamHandler, getTeamsForTodoUserHandler,
    insertTeamMemberHandler, getTeamMembersHandler};