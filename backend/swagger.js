import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Pharmacy Inventory API',
      version: '1.0.0',
      description: 'API documentation for the pharmaceutical inventory backend'
    },
    servers: [{ url: process.env.SWAGGER_SERVER_URL || 'http://localhost:4321' }],
  },
  apis: ['./controllers/*.js', './models/*.js'],
};
const swaggerSpec = swaggerJsdoc(options);
const hasPaths = swaggerSpec && swaggerSpec.paths && Object.keys(swaggerSpec.paths).length > 0;
if (!hasPaths) {
  swaggerSpec.paths = {
    '/api/products': {
      get: {
        summary: 'List products',
        responses: { '200': { description: 'List of products' } }
      },
      post: {
        summary: 'Create product',
        requestBody: { content: { 'application/json': { schema: { type: 'object' } } } },
        responses: { '201': { description: 'Product created' } }
      }
    },
    '/api/products/{id}': {
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
      get: { summary: 'Get product', responses: { '200': { description: 'Product' }, '404': { description: 'Not found' } } },
      put: { summary: 'Update product', responses: { '200': { description: 'Updated' } } },
      delete: { summary: 'Delete product', responses: { '200': { description: 'Deleted' } } }
    },
    '/api/suppliers': {
      get: { summary: 'List suppliers', responses: { '200': { description: 'List' } } },
      post: { summary: 'Create supplier', responses: { '201': { description: 'Created' } } }
    },
    '/api/suppliers/{id}': {
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
      get: { summary: 'Get supplier', responses: { '200': { description: 'Supplier' } } },
      put: { summary: 'Update supplier', responses: { '200': { description: 'Updated' } } },
      delete: { summary: 'Delete supplier', responses: { '200': { description: 'Deleted' } } }
    },
    '/api/sales': {
      get: { summary: 'List sales', responses: { '200': { description: 'Sales' } } },
      post: { summary: 'Create sale', responses: { '201': { description: 'Created' } } }
    },
    '/api/sales/{id}': {
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
      get: { summary: 'Get sale', responses: { '200': { description: 'Sale' } } },
      put: { summary: 'Update sale', responses: { '200': { description: 'Updated' } } },
      delete: { summary: 'Delete sale', responses: { '200': { description: 'Deleted' } } }
    },
    '/api/users': {
      get: { summary: 'List users', responses: { '200': { description: 'Users' } } },
      post: { summary: 'Create user', responses: { '201': { description: 'Created' } } }
    },
    '/api/users/{id}': {
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
      get: { summary: 'Get user', responses: { '200': { description: 'User' } } },
      put: { summary: 'Update user', responses: { '200': { description: 'Updated' } } },
      delete: { summary: 'Delete user', responses: { '200': { description: 'Deleted' } } }
    }
  };
}
export function setupSwagger(app) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
export default swaggerSpec;
