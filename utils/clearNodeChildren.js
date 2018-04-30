const co = require('co');
const nodeSchema = require('../models/Node');

const log = require('./log');

co(function*() {
  const cursor = nodeSchema.find().cursor(); 
  for (let doc = yield cursor.next(); doc !== null; doc = yield cursor.next()) {
    // Print the user, with the `band` field populated
    log.info('node Found, search children');

    const {children} = doc;

    for(let i = 0; i < children.length; i++) {
      const {_id} = children[i];
      const node = (yield nodeSchema.findById(_id).exec()) !== null

      if (node) log.info('Child found !')
      else {
        log.error('Node not Found, deletion in the parent node');
        const document = yield nodeSchema.findById(doc._id).exec();

        document.children = document.children.filter(child => child._id !== _id);

        yield document.save();              
        log.error('Node inexistant deleted');        
      }
    }
  }
});
