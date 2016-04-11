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
    var met = $('#metre');

    //grabs building value
    var faci = $("#place option:selected").text();

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
        console.log("testing");
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
      Cookie.set('water', wmeter);
      Cookie.set('electricity', emeter);
  }
});

