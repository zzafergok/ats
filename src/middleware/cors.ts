import cors from 'cors';

export const corsMiddleware = cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);

    // Allow all origins in development or if ALLOW_ALL_ORIGINS is set
    if (process.env.NODE_ENV === 'development' || process.env.ALLOW_ALL_ORIGINS === 'true') {
      return callback(null, true);
    }

    // In production, you might want to restrict origins
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3002',
      'http://localhost:5173',  // Vite default port
      'https://mulakat.co',
      'https://www.mulakat.co',
      // Vercel preview domains
      /.*\.vercel\.app$/,
    ];

    const isAllowed = allowedOrigins.some(allowed => {
      if (typeof allowed === 'string') {
        return allowed === origin;
      } else {
        return allowed.test(origin);
      }
    });

    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});
