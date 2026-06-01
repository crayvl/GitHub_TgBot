import express from 'express';

const server = express();

server.get('/ping', (req, res) => {
  res.sendStatus(200);
});

server.post('/webhook', (req, res) => {
  console.log('Received webhook data:', req.body);
  res.sendStatus(200);
});



server.listen(3000,'0.0.0.0', () => {
  console.log('Server is running.');
});