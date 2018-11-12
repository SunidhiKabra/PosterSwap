var methodsHandler = require('../handler/methodsHandler');

module.exports.profileController = function(app){

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

  app.post('/signIn', function(req, res){
    return methodsHandler.userLogin(req, res);
  });

  app.get('/signUp', function(req, res){
    res.render('signUp');
  });

  app.post('/signUp', function(req, res){
    return methodsHandler.userSignUp(req, res);
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

  app.post('/addPoster', function(req, res){
    if(req.session.theUser === undefined){
      res.redirect('/');
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

  app.post('/updateItem/:itemCode', function(req, res){
    return methodsHandler.updateItemFormUsingItemCode(req, res);
  });

  // app.get('/updateItem/:itemCode', function(req, res){
  //   if(req.session.theUser === undefined){
  //     res.redirect('/');
  //   }
  //   else{
  //   return methodsHandler.updateItemFormUsingItemCode(req, res);
  // }
  // });

  app.get('/swapIt/:itemCode', function(req, res){
    if(req.session.theUser === undefined){
      res.redirect('/');
    }
    else{
      return methodsHandler.userItemsAvailableForSwap(req, res);
    }
  });

  // app.get('/updateStatusAsPending', function(req, res){
  //   return methodsHandler.updateStatusAsPending(req, res);
  // });

  // /offerItem?selectedItemCode='+itemCode+'&itemForSwapId=<%= itemForSwap._id %>

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
