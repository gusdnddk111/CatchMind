var express = require('express');
var router = express.Router();

router.get('/gameRoom/:name',function(req,res){
  res.render('gameRoom');
});

module.exports = router;
