import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import user from './routes/api/users';
import auth from './routes/api/auth';
import profile from './routes/api/profile';
import { mongoURI as db } from './config/keys';

const app = express();

// Body Parser Middleware
app.use(bodyParser.json());

mongoose.connect(db, { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false })
  .then(() => {
    console.log('Connected to the database...');
  })
  .catch((err) => {
    console.log(err);
  });
//

app.get('/', (req, res) => {
  res.send('This is the root page!!');
});

app.use('/api/user', user);
app.use('/api/auth', auth);
app.use('/api/profile', profile);

// const port = process.env.PORT;
const port = 5000;

app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
