const userSchema = require('../models/User');
const path = require('path');
const fs = require('fs');
const FileSystemConfig = require('../config/FileSystemConfig'); 

const router = require('express').Router();

router.get('/image', async (req, res) => {
  try{
    const userId = req.params;
    const user = await userSchema.findById(userId);
    const chemin = path.join(FileSystemConfig.appDirectory.avatar, user.avatar);
    console.log(chemin);
    res.sendFile(chemin);    
  } catch (err) {
    console.error(err);
    res.status(404).send('Not Found');
  }
});

router.delete('/:userId', async (req, res) => {
  try {
    const userId = req.params;
    if (userId === req.session.userId);
    const user = await userSchema.findById(userId);
    await user.remove();
  } catch (e) {
    console.error(e);
  }
  res.redirect('/');
});


module.exports = router;
