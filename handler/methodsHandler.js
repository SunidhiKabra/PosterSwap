var User = require('../models/UserSchema');
var Item = require('../models/ItemSchema');
var mongoose = require('mongoose');
var async = require('async');

exports.userSignUp= function(req, res){
  var newUser = new User({
      userFirstName: req.body.userFirstName,
      userLastName: req.body.userLastName,
      userEmail: req.body.userEmail,
      userPassword: req.body.userPassword,
      userAddress1: req.body.userAddress1,
      userAddress2: req.body.userAddress2,
      userCity: req.body.userCity,
      userState: req.body.userState,
      userCountry: req.body.userCountry,
    });
    newUser.save(function (err){
      if(err){
          console.log('There was an error! '+ err);
          res.redirect('/');
      } else{
          req.session.theUser = newUser;
          res.redirect('/');
      }
    });
};

exports.userLogin= function(req, res){
  User.findOne({
    userEmail: req.body.email,
    userPassword: req.body.password
  }, function(err, user) {
      if (err)  console.log('There was an error! '+ err);
      if (!user) {
        res.redirect('/');
      } else if (user) {
        req.session.theUser = user;
        res.redirect('/');
      }
  });
};

exports.itemAdd= function(req, res){
  var newItem = new Item({
    itemName: req.body.itemName,
    itemCategory: req.body.itemCategory,
    itemDescription: req.body.itemDescription,
    itemImageUrl: req.body.itemImageUrl
    });
    newItem.save(function (err, item){
      if(err){
          console.log('There was an error! '+ err);
          res.redirect('/');
      }
      else{
        var email = req.session.theUser.userEmail;
        var password = req.session.theUser.userPassword;
        var id = {itemCode: item._id};
        User.findOneAndUpdate({
          userEmail: email,
          userPassword: password
        }, {$push: {userItems: id}}, function(err, user) {
          if (err)  console.log('There was an error! '+ err);
          if (!user) {
            console.log('User not found');
          } else if (user) {
            console.log('added successfully');
          }
        });
          res.redirect('/myPosters');
      }
    });
};

exports.getAllItems= function(req, res){
  Item.find({}, {'__v' : 0}, function(err, items) {
      if (err)  console.log('There was an error! '+ err);
      if (!items) {
        res.redirect('/');
      } else if (items) {
        Item.distinct("itemCategory", function(err, result){
          if (err)  console.log('There was an error! '+ err);
          else{
            res.render('categories', {items: items, user: null, category: result});
          }

        });

      }
  });
};

exports.getAllItemsExceptUserItems= function(req, res){
  User.findOne({
    userEmail: req.session.theUser.userEmail,
    userPassword: req.session.theUser.userPassword
  }, {'userItems.itemCode': 1, _id: 0}).exec(function(err, itemCodes){
    if(err) console.log("error = " + err);
    else{
      // console.log("itemCodes = " + itemCodes);
      if(itemCodes.userItems.length === 0){
        Item.find({}, {'__v' : 0}, function(err, items) {
            if (err)  console.log('There was an error! '+ err);
            if (!items) {
              res.redirect('/');
            } else if (items) {
              Item.distinct("itemCategory", function(err, result){
                if (err)  console.log('There was an error! '+ err);
                else{
                  res.render('categories', {items: items, user: req.session.theUser, category: result});
                }
              });
            }
        });
      }
      else{
        var justCodes = [];
        for(var i = 0; i < itemCodes.userItems.length; i++){
           justCodes.push(itemCodes.userItems[i].itemCode);

           if(justCodes.length === itemCodes.userItems.length){
             // console.log("justCodes = " + justCodes);
             Item.find({_id: {$nin: justCodes}}, {'__v' : 0}).exec(function(err, result){
               if(err) console.log("error", + err);
               else{
                 // console.log("result = " + result);
                 Item.distinct("itemCategory", {_id: {$nin: justCodes}}, function(err, category){
                   if (err)  console.log('There was an error! '+ err);
                   else{
                     // console.log("category = "  +category);
                     res.render('categories', {items: result, user: req.session.theUser, category: category});
                   }

                 });
                 // res.render('categories', {items: result, user: req.session.theUser});
               }
             });
           }
        }
      }
    }
  });
};


exports.getUserPosters = function(req, res){
  User.findOne({
    userEmail: req.session.theUser.userEmail,
    userPassword: req.session.theUser.userPassword
  }, {'userItems.itemCode' : 1,  '_id': false}).exec(function(err, result){
    if(err) console.log("error", + err);
    else{
      console.log("result = " + result);
      if(result.userItems.length === 0){
        res.render('myPosters', {userItems: null});
      }
      else{
        var userItems = [];
        var z = 1;
        var itemCodes = [];
        for(var i = 0; i < result.userItems.length; i++){
          console.log("z = " + z);
            itemCodes.push(result.userItems[i].itemCode);
            if(z == result.userItems.length){
              console.log("itemCodes = " + itemCodes);
              Item.find({_id: itemCodes}).exec(function(err, result){
                if(err) console.log("error", + err);
                else{
                  res.render('myPosters', {userItems: result});
                }
              });
            }
            z++;
        }
      }
    }
  });
};

exports.getItemUsingItemCode = function(req, res){
  var itemCode = req.params.itemCode;
  Item.findOne({_id: itemCode}, {'__v' : 0}).exec(function(err, result){
    if(err) console.log("error", + err);
    else{
      var user1 = null;
      if(req.session.theUser !== undefined){
        user1 = req.session.theUser;
      }
      res.render('itemView', {item: result, user: user1});
    }
  });
};

exports.deleteItemUsingItemCode = function(req, res){
  var itemCode = req.params.itemCode;
  Item.deleteOne({_id: itemCode}, function(err, result){
    if(err) console.log("error", + err);
    else{
      User.updateOne({
        userEmail: req.session.theUser.userEmail,
        userPassword: req.session.theUser.userPassword},
        {$pull: {'userItems': {'itemCode': itemCode}}}).exec(function(err, result){
        if(err) console.log("error", + err);
        res.redirect('/myPosters');
      });
    }
  });
};

exports.updateItemUsingItemCode = function(req, res){
  var itemCode = req.params.itemCode;
  Item.findOne({_id: itemCode}).exec(function(err, result){
    if(err) console.log("error", + err);
    else{
      console.log("item = " + result);
      res.render('itemUpdate', {item: result});
    }
  });
};

exports.updateItemFormUsingItemCode = function(req, res){
  var itemCode = req.params.itemCode;
  console.log("itemCode = " +itemCode);
  Item.findOneAndUpdate({
    _id: itemCode},
  {
      itemName: req.body.itemName,
      itemCategory: req.body.itemCategory,
      itemDescription: req.body.itemDescription,
      itemImageUrl: req.body.itemImageUrl
  }).exec(function(err, result){
    if(err) console.log("error", + err);
    else{
      res.redirect('/myPosters');
    }
  });
};

exports.swapItemOptions = function(req, res){
  var itemCode = req.params.itemCode;
  var user1 = null;
  if(req.session.theUser !== undefined){
    user1 = req.session.theUser;
  }
  Item.find({'itemStatus': 'available'}).exec(function(err, result){
    if(err) console.log("error", + err);
    else{
      res.render('swapIt', {items: result, user: user1});
    }
  });
};

exports.userItemsAvailableForSwap = function(req, res){
  var itemCode = req.params.itemCode;
  User.find({
    userEmail: req.session.theUser.userEmail,
    userPassword: req.session.theUser.userPassword
  }, {'userItems.itemCode' : 1,  '_id': false}).exec(function(err, result){
    if(err) console.log("error", + err);
    else{
        var userItems = [];
        var z = 1;
        var itemCodes = [];
        for(var i = 0; i < result.length; i++){
          for(var j = 0; j < result[i].userItems.length; j++){
            // console.log("z = " + z);
            // console.log("result = " + result);
            itemCodes.push(result[i].userItems[j].itemCode);
          }
            if(z == result.length){
              // console.log("itemCodes = " + itemCodes);
              Item.find({_id: itemCodes}).exec(function(err, result){
                if(err) console.log("error", + err);
                else{
                  Item.findOne({_id: itemCode}, {'__v' : 0}).exec(function(err, itemForSwap){
                    if(err) console.log("error", + err);
                    else{
                      res.render('swapIt', {userItems: result, user: req.session.theUser, itemForSwap: itemForSwap});
                    }
                  });
                  }
              });
            }
            z++;
        }
    }
  });
};

exports.userMySwaps = function(req, res){
  User.find({
    userEmail: req.session.theUser.userEmail,
    userPassword: req.session.theUser.userPassword
  }, {'userItems.itemCode' : 1,  '_id': false}).exec(function(err, result){
    if(err) console.log("error", + err);
    else{
        var userItems = [];
        var z = 1;
        var itemCodes = [];
        for(var i = 0; i < result.length; i++){
          for(var j = 0; j < result[i].userItems.length; j++){
            // console.log("z = " + z);
            // console.log("result = " + result);
            itemCodes.push(result[i].userItems[j].itemCode);
          }
            if(z == result.length){
              // console.log("itemCodes = " + itemCodes);
              Item.find({_id: itemCodes}).exec(function(err, result){
                if(err) console.log("error", + err);
                else{
                      res.render('mySwaps', {items: result, user: req.session.theUser});

                  }
              });
            }
            z++;
        }
    }
  });
};


exports.updateStatusAsPending = function(req, res){
  var itemCode = req.query.selectedItemCode;
  var itemForSwapId = req.query.itemForSwapId;

  Item.findOneAndUpdate({
    _id: itemCode},
  {
      itemStatus: 'waiting',
      itemSwapItem: itemForSwapId
  }).exec(function(err, result){
    if(err) console.log("error", + err);
    else{
      Item.findOneAndUpdate({
        _id: itemForSwapId},
      {
          itemStatus: 'pending',
          itemSwapItem: itemCode
      }).exec(function(err, result){
        if(err) console.log("error", + err);
        else{
          res.redirect('/mySwaps');
        }
      });
    }
  });
};

exports.acceptOffer = function(req, res){
  var itemCode = req.params.itemCode;
  Item.findOneAndUpdate({
    _id: itemCode},
  {
      itemStatus: 'swapped'
  }).exec(function(err, result){
    if(err) console.log("error", + err);
    else{
      Item.findOneAndUpdate({
        _id: result.itemSwapItem},
      {
          itemStatus: 'swapped'
      }).exec(function(err, result){
        if(err) console.log("error", + err);
        else{
          res.redirect('/mySwaps');
        }
      });
    }
  });
};

exports.rejectOffer = function(req, res){
  var itemCode = req.params.itemCode;
  Item.findOneAndUpdate({
    _id: itemCode},
  {
      itemStatus: 'available'
  }).exec(function(err, result){
    if(err) console.log("error", + err);
    else{
      Item.findOneAndUpdate({
        _id: result.itemSwapItem},
      {
          itemStatus: 'available',
          itemSwapItem: ''
      }).exec(function(err, result){
        if(err) console.log("error", + err);
        else{
          res.redirect('/mySwaps');
        }
      });
    }
  });
};

exports.getItemUsingItemCodeWithoutLogin = function(req, res){
  var itemCode = req.params.itemCode;
  Item.findOne({_id: itemCode}, {'__v' : 0}).exec(function(err, result){
    if(err) console.log("error", + err);
    else{
      var user1 = null;
      if(req.session.theUser !== undefined){
        user1 = req.session.theUser;
      }
      res.render('rateIt', {item: result, user: user1});
    }
  });
};

exports.rateItem = function(req, res){
  var itemCode = req.query.itemCode;
  var rating = parseInt(req.query.rating);
  var newRating = 0;
  var prevRating = 0;
  Item.findOne({_id: itemCode}).exec(function(err, result){
    if(err) console.log("error", + err);
    else{
      console.log("item = " + result);
      if(result.itemRating === undefined){
        prevRating = 0;
        newRating = rating;
      }
      else{
        prevRating = parseInt(result.itemRating);
        newRating = (prevRating + rating)/2;
      }
      // console.log("newRating = " + newRating);
      Item.findOneAndUpdate({
        _id: itemCode},
      {
          itemRating: newRating
      }).exec(function(err, result){
        if(err) console.log("error", + err);
        else{
          // console.log("result = "  +result);
          res.redirect('/categories');
        }
      });
    }
  });
};
