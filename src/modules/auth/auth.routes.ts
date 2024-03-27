import { FastifyInstance } from 'fastify';
import { loginJsonSchema } from './schemas/login.schema';
import { login } from './auth.controller';

export async function authRoutes(app: FastifyInstance) {
  app.post('/login', { schema: loginJsonSchema }, login);
}
