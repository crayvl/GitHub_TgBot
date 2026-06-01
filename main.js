import express from 'express';

const server = express();

server.get('/ping', (req, res) => {
  res.send('server active');
});

server.post('/webhook', (req, res) => {
  console.log('Received webhook data:', req.body);
  res.sendStatus(200);
});



server.listen(3000, () => {
  console.log('Server is running on port 3000\n http://localhost:3000');
});