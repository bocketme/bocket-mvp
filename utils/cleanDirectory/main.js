const cleanDir = require('./');

const filter = file => file !== 'a';

cleanDir('./vincy', { filter })
  .then((files) => {
    console.log('files:', files);
  })
  .catch((err) => {
    console.log('err:', err);
  });

/* cleanDir('./vincy', (err, files) => {
  console.log('fdp files:', files);
}); */

