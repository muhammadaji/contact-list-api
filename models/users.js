const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.Promise = global.Promise;
mongoose.set('debug',true);

const UsersSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  username: {
    type: 'String',
    required: true
  },
  password: {
    type: 'String',
    required: true
  }
})

module.exports = mongoose.model('Users', UsersSchema);
