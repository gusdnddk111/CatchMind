var member_db = require('./member_db.js');

module.exports = {
    join: function(req,res){
        member_db.add(req.body, function (result) {
            if (result === true) {
                console.log('signup.js, join success');
                res.json({result: true});
            } else if(result === "overlap") {
                console.log('signup.js, join fail');
                res.json({result: "overlap"});
            }
            else{
                console.log('signup.js, join fail');
                res.json({result: false});
            }
        });
    }
}
