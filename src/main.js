import express from 'express';
import TelegramBot from 'node-telegram-bot-api';

import { startBot, sendWebhook } from './bot/telegram.js';


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

    await sendWebhook(req.body);

    console.log("[INFO] New push was received.");

    res.sendStatus(200);
  }
  else {
    console.log('[WARNING] Received unsupported event type:', eventType);
    res.sendStatus(202);
  }


});



server.listen(3000,'0.0.0.0', async() => {
  console.log('Server is running.');

  await startBot();
});