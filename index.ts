import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import routes from './routes/routes.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
  origin: 'https://sokkaritu.rzkfyn.me',
  optionsSuccessStatus: 200,
}));
app.use(express.urlencoded({ extended: false }));
app.use('/', routes);

app.listen(port, () => {
  console.log(`App is running on port ${port}, http://localhost:${port}`);
});
