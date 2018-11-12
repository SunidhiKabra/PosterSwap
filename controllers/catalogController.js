var methodsHandler = require('../handler/methodsHandler');

module.exports.catalogController = function(app){

  app.get('/categories', function(req, res){
    if(req.session.theUser === undefined){
      return methodsHandler.getAllItems(req, res);
    }
    else{
      return methodsHandler.getAllItemsExceptUserItems(req, res);
    }
  });
}
