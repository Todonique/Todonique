import { registerHandler, loginHandler, setupTwoFactorAuthenticationHandler, verifyTwoFactorHandler } from './authController';
import { createTodoHandler, updateTodoHandler, deleteTodoHandler, getTodoHandler } from './todoController';

export { registerHandler, loginHandler, setupTwoFactorAuthenticationHandler, verifyTwoFactorHandler, 
    createTodoHandler, updateTodoHandler, deleteTodoHandler, getTodoHandler };