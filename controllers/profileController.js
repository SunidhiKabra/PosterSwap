var methodsHandler = require('../handler/methodsHandler');
const { check, validationResult } = require('express-validator/check');

var bodyParser = require('body-parser');
const express = require('express');


module.exports.profileController = function(app){
app.use(bodyParser.json())
app.use(express.json());

var urlencodedParser = bodyParser.urlencoded({ extended: false });


  app.get('/', function(req, res){
    var isSignedIn1 = false;
    var user1 = null;
    var message1 = 'You are not signed in';
    if(req.session.theUser !== undefined){
      isSignedIn1 = true;
      user1 = req.session.theUser;
      message1 = "You are signed in";
    }
    var data = {
      isSignedIn: isSignedIn1,
      message: message1,
      user: user1
    }
    res.render('index', {data: data});
  });

  app.get('/signIn', function(req, res){
    var isSignedIn1 = false;
    var user1 = null;
    var message1 = 'You are not signed in';
    if(req.session.theUser !== undefined){
      isSignedIn1 = true;
      user1 = req.session.theUser;
      message1 = "You are signed in";
    }
    var data = {
      isSignedIn: isSignedIn1,
      message: message1,
      user: user1
    }
    res.render('signIn', {data: data});
  });

  app.post('/signIn', [
    check('email').isEmail().trim().escape(),
    check('password').isLength({ min: 5 }).trim()
  ], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render('errorPage', {errors: errors.array()});
    }
    else{
        return methodsHandler.userLogin(req, res);
    }
  });

  app.get('/signUp', function(req, res){
    res.render('signUp');
  });

  app.post('/signUp', [
  check('userEmail').isEmail().trim().escape(),
  check('userPassword').isLength({ min: 5 }).trim()
  ], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render('errorPage', {errors: errors.array()});
    }
    else{
      return methodsHandler.userSignUp(req, res);
    }
  });

  app.get('/signout', function(req, res){
    req.session.destroy();
    res.redirect('/');
  });

  app.get('/myPosters', function(req, res){
    if(req.session.theUser === undefined){
      res.redirect('/');
    }
    else{
      return methodsHandler.getUserPosters(req, res);
      // res.render('myPosters');
    }
  });

  app.get('/addPoster', function(req, res){
    if(req.session.theUser === undefined){
      res.redirect('/');
    }
    else{
      res.render('addPoster');
    }
  });

  app.post('/addPoster', [
    check('itemName').isLength({ min: 3 }).trim().escape(),
    check('itemCategory').isLength({ min: 3 }).trim().escape()
  ], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    else{
        return methodsHandler.itemAdd(req, res);
    }
  });

  app.get('/categories/item/:itemCode', function(req, res){
    return methodsHandler.getItemUsingItemCode(req, res);
  });

  app.get('/deleteItem/:itemCode', function(req, res){
    return methodsHandler.deleteItemUsingItemCode(req, res);
  });

  app.get('/updateItem/:itemCode', function(req, res){
    return methodsHandler.updateItemUsingItemCode(req, res);
  });

  app.post('/updateItem/:itemCode', [
    check('itemName').isLength({ min: 3 }).trim().escape(),
    check('itemCategory').isLength({ min: 3 }).trim().escape()
  ], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    else{
        return methodsHandler.updateItemFormUsingItemCode(req, res);
    }
  });


  app.get('/swapIt/:itemCode', function(req, res){
    if(req.session.theUser === undefined){
      res.redirect('/');
    }
    else{
      return methodsHandler.userItemsAvailableForSwap(req, res);
    }
  });

  app.get('/offerItem', function(req, res){
    if(req.session.theUser === undefined){
      res.redirect('/');
    }
    else{
    return methodsHandler.updateStatusAsPending(req, res);
  }
  });

  app.get('/mySwaps', function(req, res){
    if(req.session.theUser === undefined){
      res.redirect('/');
    }
    else{
      return methodsHandler.userMySwaps(req, res);
    }
  });

  app.get('/accept/:itemCode', function(req, res){
    if(req.session.theUser === undefined){
      res.redirect('/');
    }
    else{
      return methodsHandler.acceptOffer(req, res);
    }
  });

  app.get('/reject/:itemCode', function(req, res){
    if(req.session.theUser === undefined){
      res.redirect('/');
    }
    else{
      return methodsHandler.rejectOffer(req, res);
    }
  });

  app.get('/cancel/:itemCode', function(req, res){
    if(req.session.theUser === undefined){
      res.redirect('/');
    }
    else{
      return methodsHandler.rejectOffer(req, res);
    }
  });

  app.get('/withdraw/:itemCode', function(req, res){
    if(req.session.theUser === undefined){
      res.redirect('/');
    }
    else{
      return methodsHandler.rejectOffer(req, res);
    }
  });

  app.get('/rateIt/:itemCode', function(req, res){
      return methodsHandler.getItemUsingItemCodeWithoutLogin(req, res);
  });

  app.get('/doneRating', function(req, res){
      return methodsHandler.rateItem(req, res);
  });

}
