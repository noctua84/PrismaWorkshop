import express, {Express, Request, Response} from 'express';
import apiRouter from './src/apiRouter';

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/', (req: Request, res: Response): void => {
  res.send('Hello World!');
});

app.use('/api', apiRouter)


app.listen(3000, () => {
    console.log('Server is running');
});
