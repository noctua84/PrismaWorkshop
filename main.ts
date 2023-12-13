import express, {Express, Request, Response} from 'express';

const app: Express = express();

app.get('/', (req: Request, res: Response): void => {
  res.send('Hello World!');
});

app.post('/', (req: Request, res: Response): void => {
  res.send('Got a POST request');
});

app.listen(3000, () => {
    console.log('Server is running');
});
