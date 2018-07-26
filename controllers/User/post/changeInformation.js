const userSchema = require('../../../models/User');

module.exports = async function changeInformation(req, res) {
  try {
    const { userId } = req.session;
    const completeName = req.body.completeName;

    const user = await userSchema.findById(userId);
    if (completeName)
      user.completeName = completeName;

    await user.save();
    res.status(200).send('OK');
  } catch (error) {
    console.error(new Error(error));
    res.status(500).send('Intern Error');
  }
};
