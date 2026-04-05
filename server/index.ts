import express from 'express';
import cors from 'cors';
import analyzeRouter from './routes/analyze.js';
import chatRouter from './routes/chat.js';
import videosRouter from './routes/videos.js';
import contractorsRouter from './routes/contractors.js';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/analyze', analyzeRouter);
app.use('/api/chat', chatRouter);
app.use('/api/videos', videosRouter);
app.use('/api/contractors', contractorsRouter);

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
