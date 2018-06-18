const userSchema = require('../models/User');
const organizationSchema = require('../models/Organization');
const path = require('path');
const fs = require('fs');
const FileSystemConfig = require('../config/FileSystemConfig');
const log = require('../utils/log');
const router = require('express').Router();

router.get('/image', async (req, res) => {
  try {
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

router.get('/Ownership', async function userOwnership(req, res) {
  try {
    const organizations = await organizationSchema
      .find({ Owner: req.session.userId })
      .select("name");
    return res.render('socket/userOwnership.twig', { organizations });
  } catch (e) {
    log.error(e);
    res.status(500).send('Intern Error');
  }
});

router.delete('/', async (req, res) => {
  try {
    const { userId } = req.session;
    const user = await userSchema.findById(userId);
    const organizations = await organizationSchema.findBy
    const organizationsOwner = await user.organizationOwner();
    await user.remove();
    return res.status(200).json({ organizations: organizationsOwner })
  } catch (e) {
    log.error(e);
    return res.status(500).send('Intern Error');
  }
});


module.exports = router;
