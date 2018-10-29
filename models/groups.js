const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.Promise = global.Promise;
mongoose.set('debug',true);

const GroupsSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: {
    type: 'String',
    required: true
  },
  contacts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contacts'
  }]
})

module.exports = mongoose.model('Groups', GroupsSchema);
