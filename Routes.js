Router.route('/', function(){

});

Router.route('/settings', function(){
    Meteor.call("getBuildings", function(error, results) {
        if (error){
            console.log(error);
        } else{
            Session.set('buildings', results);
        }
    });
    this.render('pageLayout');
});
Router.route('/savedBlocks', function(){
    this.render('listOrbs');
});

Router.route('/guage1', function(){
   this.render('guage1')
});