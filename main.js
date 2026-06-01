import express from 'express';

const server = express();

server.use(express.json());

server.get('/ping', (req, res) => {
  res.sendStatus(200);
});

server.post('/webhook', async(req, res) => {
  const eventType = req.headers['x-github-event'];

  if(eventType == 'ping') res.sendStatus(200);
  else if(eventType == 'push') {

    const payload = req.body;
    console.log('Repository name:', payload.repository.full_name);
    console.log('Pusher: ', payload.repository.pusher.name);

    res.sendStatus(200);
  }
  else {
    console.log('Received unsupported event type:', eventType);
    res.sendStatus(202);
  }


});



server.listen(3000,'0.0.0.0', () => {
  console.log('Server is running.');
});