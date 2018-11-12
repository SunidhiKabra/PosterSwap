module.exports.siteNavigationController = function(app){

  app.get('/home', function(req, res){
    res.redirect('/');
  });

  app.get('/index', function(req, res){
    res.redirect('/');
  });

  app.get('/contact', function(req, res){
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
    res.render('contact', {data: data});
  });

  app.get('/about', function(req, res){
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
    res.render('about', {data: data});
  });

}
