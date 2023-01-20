
const express = require('express');
const app = express();

const sendMail = require('./src/Email/Email');


app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/email/send', async (req, res) => {

    await sendMail('harshituem@gmail.com',"Hey Testing",undefined);
    res.send('<H1> Hey Got ur Req </H1>');

})


app.listen(3000, () => {
  console.log('Server started on port 3000');
});


