var member_db = require('./member_db.js');

module.exports = {
    login: function(req,res){
        console.log(req.body+"2");
        member_db.login(req.body, function (result) {
            var pos = result.result;
            console.log(pos+"4");
            if(pos == true) {
                console.log(result.user);
                req.session.userid = result.user.NAME;
                return res.json({result: 'success', user: result.user});
            }
            else{
                return res.json({result: 'login_fail'});
            }
        });
    }
}
