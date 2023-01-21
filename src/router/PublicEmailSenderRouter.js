const express = require('express');
const router = new express.Router();
const emailSender = require('../Email/EmailSender');




router.get('/public/email/notification', async (req, res) => {

    await emailSender('harshit107.in@gmail.com',"Hey This is a tesing message",null);

    res.send("<H2> Successful </H2> ");


})

module.exports = router;