const TOKEN = process.env.TOKEN;
const bot = require('@/bot');
const express = require('express');
const bodyParser = require('body-parser');
const { sendScheduleMessage } = require('./functions/lessonsPin');

const app = express();
app.use(bodyParser.json());

app.post('/' + TOKEN, async (req, res) => {
    bot.processUpdate(req.body);
    res.sendStatus(200);
});

app.post('/sendScheduleMessage', async (req, res) => {
    await sendScheduleMessage(null, false);
    res.sendStatus(200);
});

app.listen(3000, () => console.log('Server stated on 3000 port'));