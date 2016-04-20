// This is where we go through the collection, and do all the stuff that makes the lifx bulbs into orbs.

Meteor.setInterval(function() {
    avgTime = 7;
    now = new Date();
    nowISO = now.toISOString();
    then = new Date();
    then.setDate(then.getDate()-avgTime);
    thenISO = then.toISOString();
    orbDotPy();
}, 10 * 1000);

// Loops through collection and calls updateOrb on each orb.
function orbDotPy (){
    Orbs.find().forEach(function(orb){
        updateOrb(orb);
    })
}

function updateOrb (orb){
    var waterPoint = orb.water;
    var elecPoint = orb.elec;

    getColor(waterPoint, function(returnValue) {
        console.log(returnValue);
    });
    getColor(elecPoint, function(returnValue) {
        console.log(returnValue);
    });

}

function lifxCall (orb, color){
    var apiUrl = "https://api.lifx.com/v1/lights/:"+orb.selector+"/effects/breathe";
    var result = HTTP.post( apiUrl, {
        data: {
            "period": 1,
            "cycles": 100,
            "color": color,
        },
        headers:{
            "content-type":"application/json",
            "Authorization": "Bearer " + "cbb30e4f1d36b2736c162399d570bb9803b3eb8158d303df5bd00fcfa9ccdee1"
        }
    });

    console.log(result);
}

function getColor (point, callback){
    Meteor.call('makeCall', 0, 0, point, 'live', function(error, results) {
        if (error) {
            console.log(error);
        } else {
            Meteor.call('makeCall', thenISO, nowISO, point, 'hour', function(error, secondResults) {
                if (error){
                    console.log(error);
                } else{
                    var current  = findAverageCurrentUsage(5,results);
                    var typical = typicalUsage(secondResults);
                    callback(setColor(current,typical));
                }
            });
        }
    });
}

function findAverageCurrentUsage(numMinutes, data) {
    var counter = 0;
    var total = 0;
    for(var i = data[1].length-1; i > data[1].length - 6; i--) {
        total += data[1][i];
        counter += 1;
        if(counter >= numMinutes){
            break;
        }
    }
    var average;
    if(counter != 0){
        average = total / counter
    } else {
        average = 0;
    }
    return average
}

function typicalUsage(data){
    var total = 0;
    var counter = 0;
    var index = data[0].length - 1;
    var done = false;
    var value;
    var date;

    while(!done){
        value = data[1][index];
        date  = new Date(data[0][index]);
        if(date.getHours() == now.getHours()){
            total += value;
            counter++;
        }
        if(counter >= avgTime){
            done = true;
        }
        index--;
    }
    return total/avgTime;
}

function setColor(current, typical) {
    var relative = current / typical;
    var color;
    if (relative <= .5) {
        color = "green"
    }
    if (relative > .5 && relative < .8) {
        color = "#adff2f"
    }
    if (relative >= .8 && relative <= 1.2) {
        color = "yellow"
    }
    if (relative > 1.2 && relative < 1.5) {
        color = "orange"
    }
    if (relative >= 1.5) {
        color = "red"
    }
    return color;
}