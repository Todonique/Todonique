import { registerHandler, loginHandler, setupTwoFactorAuthenticationHandler, verifyTwoFactorHandler } from './authController';
import { createTodoHandler, updateTodoHandler, getTodosByUserInTeamHandler } from './todoController';

export { registerHandler, loginHandler, setupTwoFactorAuthenticationHandler, verifyTwoFactorHandler, 
    createTodoHandler, updateTodoHandler, getTodosByUserInTeamHandler };