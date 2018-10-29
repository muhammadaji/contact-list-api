const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.Promise = global.Promise;
mongoose.set('debug',true);

const ContactsSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: {
    type: 'String',
    required: true
  },
  number: {
    type: 'String',
    required: true
  },
  email: {
    type: 'String',
  },
  address: {
    type: 'String',
  },
  groups: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Groups'
  }]
});

module.exports = mongoose.model('Contacts', ContactsSchema);
