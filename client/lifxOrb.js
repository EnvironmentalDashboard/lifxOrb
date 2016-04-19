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
    Session.set('curBuilding', indx);

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
      var point = $("#metre option:selected").attr("value");
      var wmeter = $("#waterMetre option:selected").attr("value");
      var emeter = $("#elecMetre option:selected").attr("value");

      for(met in Session.get('buildings')[Session.get("curBuilding")]['meters']) {
        temp = Session.get('buildings')[Session.get("curBuilding")]['meters'][met]['name'];
        if(temp = wmeter){
          console.log(temp);
          Cookie.set('waterName', Session.get('buildings')[Session.get("curBuilding")]['meters'][met]['displayName']);
        } else if(temp = emeter) {
          console.log(temp);
          Cookie.set('electricityName', Session.get('buildings')[Session.get("curBuilding")]['meters'][met]['displayName']);
        }
      }

      Cookie.set('water', wmeter);
      Cookie.set('electricity', emeter);
  }
});

Template.save.events({
  'click': function () {
    orbData = [Cookie.get('water'),Cookie.get('electricity'), document.getElementById("selectorString").value, Cookie.get('building')];
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
    Meteor.call('removeOrb', this, function (error) {
      if (error) {
        console.log(error);
      } else {
      }
    })
  }
});

Template.loadOrb.events({
  'click': function () {
      Cookie.set('water', this.water);
      Cookie.set('electricity', this.elec);
      for(met in Session.get('buildings')[Session.get("curBuilding")]['meters']) {
        temp = Session.get('buildings')[Session.get("curBuilding")]['meters'][met]['name'];
        if(temp = wmeter){
          Cookie.set('waterName', Session.get('buildings')[Session.get("curBuilding")]['meters'][met]['displayName']);
        }
        if(temp = emeter) {
          Cookie.set('electricityName', Session.get('buildings')[Session.get("curBuilding")]['meters'][met]['displayName']);
        }
      }
  }
});

Template.listOrbs.helpers({
  orbs: function() {
    return Orbs.find();
  }
});

