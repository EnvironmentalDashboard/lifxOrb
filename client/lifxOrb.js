Template.facility.helpers({
  'building': function(){
    var list = [];
    for(element in Session.get('buildings')){
      list.push(Session.get('buildings')[element]['name']);
    }
    return list;
  }
});

Template.facility.events({
  'change': function(){
    //grabs the meter dropdown
    var met = $('.metre');

    //grabs building value
    var faci = $("#place option:selected").text();
    Cookie.set('building', faci);

    //gets the current index. -1 because of the blank option
    var indx = $("#place").prop("selectedIndex") - 1;

    //clears the meter dropdown
    met.html('');

    //adds blank option
    var blank = document.createElement('option');
    blank.selected = "selected";
    met.append(blank);

    var buildings = Session.get('buildings');

    //populates the new dropdown with filtered meter info
    for( var item in buildings[indx]['meters']) {
      var op = document.createElement('option');
      op.value = buildings[indx]['meters'][item]['name'];
      op.text = buildings[indx]['meters'][item]['displayName'];
      met.append(op);
    }
  }
});


Template.meters.helpers({
  'meter': function(){
    var list = [];
    for(element in Session.get('buildings')){
      for(met in Session.get('buildings')[element]['meters']) {
        list.push(Session.get('buildings')[element]['meters'][met]['name']);
      }
    }
    return list;
  }
});


Template.meters.events({
  'change': function(){
    var indx = $("#place").prop("selectedIndex") - 1;
    var wmeter = $("#waterMetre option:selected").attr("value");
    var point = $("#metre option:selected").attr("value");

    //grabs point name
    Cookie.set('meter', wmeter);






    //console.log("and metre name: ", point);

    Meteor.call('makeCall', 0, 0, wmeter, 'live', function(error, results) {
      console.log("test");
      if (error){
        console.log(error);
      } else{
        Session.set('point', results);
        //console.log('INSIDEBUILDINGBLOCKS.JS', Session.get('point'));
      }
      //Get building and point names
      var buildingSelected = $("#place option:selected").text();
      var meterSelected = $("#metre option:selected").text();

      //changes h3 tag
      var live = Session.get('point');
      //console.log("length is : ", live.length);
      var aLength = live[0].length -1;
      //console.log(live[1][aLength]);
      //console.log(live[0][aLength]);
      Cookie.set("mostRecentPoint", live[1][aLength]);
      $("#recentPoint").text(live[1][aLength]);


      var preview = $('#preview');
      var iframeLoading = $('#iframeLoading');
      var errorContainer = $('#errorContainer');
      var previewContainer = $('#previewContainer');
      preview.load(function(){
        console.log("inside preview load function");
        iframeLoading.hide();
        preview.show();
      });

      //previewContainer.affix({
      //    offset: {
      //        top: (previewContainer.offset().top - 70)
      //    }
      //});

      //$("#errorContainer").hide();
      //$("#previewContainer").show();
      //
      //$("#preview").show();

      iframeLoading.show();
      //preview.hide();
      errorContainer.hide();
      previewContainer.show();
      preview.attr('src', '/guage1');
      //preview.attr('src', '/blocks/' + id + '/?preview=1');
      preview.show();
      // $("#recentPoint").text(live[1][aLength]);


      //preview.load(function(){
      //    console.log("inside preview load function");
      //    iframeLoading.hide();
      //    preview.show();
      //});

      //$("#errorContainer").hide();
      //$("#previewContainer").show();
      //$("#preview").show();

      //IframeCollection.insert({
      //    createdAt: new Date(),
      //    title: point,
      //    content: iframeLoading
      //});


    });


  }

});

//Template.meters.events({
//  'change': function(){
//      var point = $("#metre option:selected").attr("value");
//      var wmeter = $("#waterMetre option:selected").attr("value");
//      //var emeter = $("#elecMetre option:selected").attr("value");
//
//      //Cookie.set('electricity', emeter);
//
//  }
//});

Template.save.events({
  'click': function () {
    orbData = [Cookie.get('meter'), document.getElementById("selectorString").value, Cookie.get('building'), Cookie.get('mostRecentPoint')];
    Meteor.call('insertOrb', orbData, function (error) {
      if (error) {
        console.log(error);
      } else {
      }
    })
  }
});

Template.remove.events({
  'click': function () {
    console.log(this);
    Meteor.call('removeOrb', this, function (error) {
      if (error) {
        console.log(error);
      } else {
      }
    })
  }
});
Template.returnToSaved.events({
  'click': function() {
    Router.go('/savedBlocks');
  }
});

Template.CreateNewBlock.events({
  'click': function() {
    Router.go('/settings');
  }
});

Template.listOrbs.helpers({
  orbs: function() {
    console.log("helper");
    return Orbs.find();
  }
});
Template.save.events({
  'click': function(){
    Router.go('/savedBlocks')
  }
});
