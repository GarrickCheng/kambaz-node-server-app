import Database from './Kambaz/Database/index.js';

export default function Hello(app) {
  app.get('/hello', (req, res) => {
    res.send('Life is good!');
  });
  app.get('/', (req, res) => {
    res.send('Welcome to Full Stack Development!');
  });
  app.get('/api/courses', (req, res) => {
    res.json(Database.courses);
  });
}