import cors from 'cors'
import dotenv from 'dotenv';
import express from 'express';
import login from '#login/router';

dotenv.config();
const app = express();
app.use(cors())
app.use(express.json({ limit: '100mb' }))

app.use(login)

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server is running on http://localhost:${port}`));
