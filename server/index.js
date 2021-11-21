import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv'

dotenv.config()

// Routers.
import itemRoutes from './routes/items.js';

// Start new Express application.
const app = express();

// Middleware.
app.use('/items', itemRoutes);

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

// MongoDB
const CONNECTION_URL = process.env.CONNECTION_URL
const PORT = process.env.PORT || 3001;

mongoose.connect(CONNECTION_URL)
  .then(() => app.listen(PORT, () => console.log(`Server listening on PORT ${PORT}`)))
  .catch((error) => console.log(error.message));