import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import connectDB from './configs/db.js';
import adminRouter from './routes/adminRoutes.js';
import blogRouter from './routes/blogRoutes.js';
import jwt from 'jsonwebtoken';

const app = express();

// Connect to MongoDB
await connectDB();

// Allowed origins for CORS
const allowedOrigins = [
  'https://blog-app-uqua-cuhe72u97-saumya-kumars-projects-085b9e4b.vercel.app',
  'http://localhost:5173', // frontend dev
];

// Middlewares
app.use(cors({
  origin: function(origin, callback){
    if(!origin) return callback(null, true); // allow Postman/curl
    if(allowedOrigins.indexOf(origin) === -1){
      return callback(new Error('Not allowed by CORS'), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

app.use(express.json());

// Token verification middleware
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Unauthorized: No token provided' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Forbidden: Invalid token' });
    req.user = user;
    next();
  });
};

// Routes
app.get('/', (req, res) => res.send('API is Working'));

// Admin routes require token verification
app.use('/api/admin', verifyToken, adminRouter);

// Public blog routes
app.use('/api/blog', blogRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Server is running on port ' + PORT);
});

export default app;
