const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const Contacts = require('./models/contacts');
const Groups = require('./models/groups');
const Users = require('./models/users');

//contacts router

router.get('/contacts',(req, res) => {
      Contacts.find({})
        .populate('groups', 'name')
        .then(function(result){
          res.send(result)
    });
});

router.get('/contacts/:id', function(req, res){
  Contacts.findOne({_id: req.params.id})
    .then(function(result){
      res.send(result)
    })
});

router.post('/contacts', (req, res, next) => {
  const contact = new Contacts({
    _id:  mongoose.Types.ObjectId(),
    ...req.body
  });
  contact.save()
    .then(result => {
      res.status(201).send(result)
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      })
    })
})

router.put('/contacts/:id', (req,res) => {
  Contacts.findOneAndUpdate({_id: req.params.id}, req.body, {new: true})
  .then(success => {
    res.send(success)
  })
})

router.delete('/contacts/:id', (req, res) => {
  Contacts.findOneAndRemove({_id: req.params.id})
  .then(deleted => {
    deleted.groups.forEach(groupsId => {
      Groups.findOneAndUpdate({_id: groupsId}, {$pull: {contacts: req.params.id}})
      .then(success => res.status(200))
    })
    res.status(200).send(deleted)
  })
})

//groups router

router.post('/groups', (req, res, next) => {
  const group = new Groups({
    _id:  mongoose.Types.ObjectId(),
    name: req.body.name,
    contacts: req.body.contacts
  });
  group.save()
    .then(result => {
      res.status(201).send(result)
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      })
    })
})

router.get('/groups',(req, res) => {
  Groups.find()
    .populate('contacts', 'name')
    .exec()
    .then(result => {
      res.status(200).send(result)
    })
    .catch(err => {
      res.status(500).json({
        error: err
      })
    })
});

router.get('/groups/:id',(req, res) => {
  Groups.findOne({_id: req.params.id})
    .populate('contacts')
    .exec()
    .then(result => {
      res.status(200).send(result)
    })
    .catch(err => {
      res.status(500).json({
        error: err
      })
    })
});

router.put('/groups/:id', function(req, res){
  Groups.findOneAndUpdate(
    {_id: req.params.id},
    {$push: {contacts: {$each: req.body.contacts}}},
    {new: true}
  )
  .then(result => {
    req.body.contacts.forEach(contactId => {
      Contacts.findOneAndUpdate({_id: contactId}, {$push: {groups: req.params.id}})
      .then(success => res.status(200).send(result))
    })
  })
});

router.delete('/groups/:id', (req, res) => {
  Groups.findOneAndRemove({_id: req.params.id})
  .then(deleted => {
    deleted.contacts.forEach(contactsId => {
      Contacts.findOneAndUpdate({_id: contactsId}, {$pull: {groups: req.params.id}})
      .then(result => res.status(200))
    })
    res.status(200).send(deleted)
  })
})


router.post('/post', verifyToken, (req, res) => {
  res.json({
    message: 'WELCOME'
  });
});

router.get('/users', (req, res) => {
  Users.find({})
  .then(result => res.status(200).send(result))
})

router.delete('/users/:id', (req, res) => {
  Users.findOneAndRemove({_id: req.params.id})
  .then(result => res.status(200).send(result))
})

router.put('/users', (req, res, next) => {
  Users.findOne({username: req.body.username}, (err,data) => {
    if (err) res.sendStatus(500)
      if (data) {
        if (data.password == req.body.password) {
          jwt.sign(req.body, 'kunci', (err, token) => {
            res.json({logged: true, token: token})
          })
        }else{
          res.json({logged: false, message: "Your Username or Password is wrong"})
        }
      }else{
        res.json({logged: false,  message: "Your Username or Password is Wrong"})
      }
   })
})

//jsonwebtoken
// router.post('/login', (req, res) => {
//   //Mock User`
//   const user = {
//     username: req.body.username,
//     password: req.body.password
//   }
//
//   jwt.sign({user}, 'secretkey', (err, token) =>{
//     res.json({
//       token
//     })
//   });
// })

//FORMAT OF TOKEN
// Authorization: Bearer <access_token>

//verifyToken
function verifyToken(req, res, next){
  // get auth header value
  const bearerHeader = req.headers['authorization'];
  // Check if bearer undefined
  if (typeof bearerHeader !== 'undefined') {
    //split at the space
    const bearer = bearerHeader.split(' ');
    //get token from array
    const bearerToken = bearer[1];
    //set the tokern
    req.token = bearerToken;
    //Next
    next();
  } else {
    //Forbidden
    res.sendStatus(403)
  }

}



module.exports = router;
