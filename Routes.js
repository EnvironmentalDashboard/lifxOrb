Router.route('/', function(){
    Meteor.call("getBuildings", function(error, results) {
        if (error){
            console.log(error);
        } else{
            Session.set('buildings', results);
        }
    });
    this.render('pageLayout');
});
