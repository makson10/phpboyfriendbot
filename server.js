const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

//* For Prod:
// app.post(`/${TOKEN}`, (req, res) => {
//     bot.processUpdate(req.body);
//     res.sendStatus(200);
// });

// app.listen(3000, () => {
//     console.log('Server stated on 3000 port');
// });