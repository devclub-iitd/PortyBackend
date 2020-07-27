import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import lusca from 'lusca';
import helmet from 'helmet';
import user from './routes/api/users';
import auth from './routes/api/auth';
import profile from './routes/api/profile';
import cookieParser from 'cookie-parser';

const app = express();

// Body Parser Middleware
app.use(bodyParser.json());

// General Middleware
app.use(cors({ credentials: true, origin: 'http://localhost:3000/' }));
app.use(helmet());
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));
app.use(cookieParser());

// for debug purposes:
// local : mongodb://127.0.0.1/my_database
// docker : mongodb://database:27017/porty_backend
// online : mongodb+srv://jatin:<password>@cluster0-fyl7v.mongodb.net/test?retryWrites=true&w=majority

mongoose
    .connect(
        'mongodb+srv://jatin:jatin@cluster0-fyl7v.mongodb.net/test?retryWrites=true&w=majority',
        {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
        }
    )
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

const port = process.env.PORT;

app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
});
