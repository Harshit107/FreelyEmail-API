const express = require('express');
const app = express();
const emailRouter = require('./src/router/PublicEmailSenderRouter');

const PORT = process.env.PORT || 3000;
// app.use(express.json())

//router
app.use(emailRouter)





app.get('/checkServer', (req, res) => {
  res.send('<H1> Hey developer,</H1> <H3>Server is working Perfectily fine </H3>');
});

app.listen( PORT, () => {
  console.log(`Server started on port ${PORT}`);
});


