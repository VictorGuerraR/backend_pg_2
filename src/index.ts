import express from 'express';
import login from '#login/router'

const app = express();
app.use(login)

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server is running on http://localhost:${port}`));
