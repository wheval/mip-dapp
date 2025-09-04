import Fastify from 'fastify'
import cors from "@fastify/cors";
import { assetsRoutes } from './routes/assets';
import { collectionsRoutes } from './routes/collection';
import { transfersRoutes } from './routes/transfers';
import { statsRoutes } from './routes/stats';

const fastify = Fastify({
  logger: {
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  }
});

// Register CORS
fastify.register(cors, {
  origin: process.env.NODE_ENV === "production" ? ["https://yourdomain.com"] : true,
  credentials: true
});

// Add global error handler
fastify.setErrorHandler(async (error, request, reply) => {
  fastify.log.error(error);
  
  if (error.validation) {
    reply.status(400).send({
      error: 'Validation Error',
      details: error.validation
    });
    return;
  }

  reply.status(500).send({
    error: 'Internal Server Error'
  });
});

// Add global preHandler for request logging
fastify.addHook('preHandler', async (request, reply) => {
  fastify.log.info({
    method: request.method,
    url: request.url,
    params: request.params,
    query: request.query
  }, 'Incoming request');
});

// Register routes
fastify.register(assetsRoutes, { prefix: "/api" });

// fastify.register(async function (fastify) {
//   await fastify.register(collectionsRoutes);
// }, { prefix: '/api' });

// fastify.register(async function (fastify) {
//   await fastify.register(transfersRoutes);
// }, { prefix: '/api' });

// fastify.register(async function (fastify) {
//   await fastify.register(statsRoutes);
// }, { prefix: '/api' });

// Health check endpoint
fastify.get('/health', async (request, reply) => {
  try {
    // Test database connection
    const { db } = await import('../lib/db');
    await db.execute('SELECT 1');
    
    reply.send({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      database: 'connected'
    });
  } catch (error:any) {
    fastify.log.error('Health check failed:', error);
    reply.status(503).send({ 
      status: 'error', 
      timestamp: new Date().toISOString(),
      database: 'disconnected'
    });
  }
});

// Root endpoint
fastify.get('/', async (request, reply) => {
  reply.send({
    message: 'NFT Indexer API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      assets: '/api/assets',
      collections: '/api/collections',
      transfers: '/api/transfers',
      stats: '/api/stats'
    },
    documentation: 'https://github.com/your-repo/nft-indexer-api'
  });
});

// Graceful shutdown
const gracefulShutdown = async () => {
  fastify.log.info('Starting graceful shutdown...');
  
  try {
    await fastify.close();
    fastify.log.info('Server closed successfully');
    process.exit(0);
  } catch (error:any) {
    fastify.log.error('Error during shutdown:', error);
    process.exit(1);
  }
};

// Handle shutdown signals
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Start server
const start = async () => {
  try {
    const port = parseInt(process.env.PORT || '3000');
    const host = process.env.HOST || '0.0.0.0';
    
    await fastify.listen({ port, host });
    
    fastify.log.info(`
🚀 NFT Indexer API Server running!
📍 Address: http://${host}:${port}
🏥 Health: http://${host}:${port}/health
📚 API Base: http://${host}:${port}/api
    `);
  } catch (err:any) {
    fastify.log.error('Failed to start server:', err);
    process.exit(1);
  }
};

// Handle uncaught exceptions
process.on('uncaughtException', (error:any) => {
  fastify.log.fatal('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  fastify.log.fatal(`Unhandled Rejection at:${reason}`,);
  process.exit(1);
});

start();
