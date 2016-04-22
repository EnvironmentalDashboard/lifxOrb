// This is where we go through the collection, and do all the stuff that makes the lifx bulbs into orbs.

water = true;

//test()
//
//function test (){
//    Orbs.find().forEach(function(orb){
//        console.log(orb);
//    })
//}

// Every minute update what colors they should be.
Meteor.setInterval(function() {
    avgTime = 7;
    now = new Date();
    nowISO = now.toISOString();
    then = new Date();
    then.setDate(then.getDate()-avgTime);
    thenISO = then.toISOString();
    orbDotPy();
}, 60 * 1000);

// Every 10 seconds switch which is displayed
Meteor.setInterval(function(){
    displayAll(water);
    water = !water;
}, 10 * 1000);

// Loops through collection and calls updateOrb on each orb.
function orbDotPy (){
    Orbs.find().forEach(function(orb){
        updateOrb(orb);
    })
}

// Loops through and sends commands to orbs
function displayAll (){
    Orbs.find().forEach(function(orb){
        lifxCall(orb);
    })
}

function updateOrb (orb){
    var waterPoint = orb.water;
    var elecPoint = orb.elec;
    getColor(waterPoint, true, orb, function(returnValue) {
    //    console.log(returnValue);
        Orbs.update({selector:orb.selector},{$set:{waterColor:returnValue}});
    });
    getColor(elecPoint, false, orb, function(returnValue) {
    //    console.log(returnValue);
        Orbs.update({selector:orb.selector},{$set:{elecColor:returnValue}});
    });
}

function lifxCall (orb){
    var orbColor;
    if(water){
        orbColor = orb.waterColor;
    //    console.log("Sending color: " + orb.waterColor)
    } else {
        orbColor = orb.elecColor;
    //console.log("Sending color: " + orb.elecColor)
    }
    var apiUrl = "https://api.lifx.com/v1/lights/"+orb.selector+"/effects/breathe";
    var result = HTTP.post( apiUrl, {
        data: {
            "period": 2,
            "cycles": 100,
            "color":"brightness:0.15",
            "from_color":orbColor
        },
        headers:{
            "content-type":"application/json",
            "Authorization": "Bearer " + "cbb30e4f1d36b2736c162399d570bb9803b3eb8158d303df5bd00fcfa9ccdee1"
        }
    });
    console.log(result);
}

function getColor (point, isWater, orb, callback){
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
                    callback(setColor(current,typical, isWater, orb));
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

function setColor(current, typical, isWater, orb) {
    var relative = current / typical;
    var color;
    if(!isWater){
        if (relative <= .5) {
           // document.getElementById("waterPrev").className = "orb-pic-container water water-0";
            color = "hue:120 saturation:0.6 brightness:1.0"
        }
        if (relative > .5 && relative < .8) {
           // document.getElementById("waterPrev").className = "orb-pic-container water water-1";
            color = "hue:83 saturation:1.0 brightness:1.0"
        }
        if (relative >= .8 && relative <= 1.2) {
           // document.getElementById("waterPrev").className = "orb-pic-container water water-2";
            color = "hue:60 saturation:1.0 brightness:1.0"
        }
        if (relative > 1.2 && relative < 1.5) {
           // document.getElementById("waterPrev").className = "orb-pic-container water water-3";
            color = "hue:38 saturation:1.0 brightness:1.0"
        }
        if (relative >= 1.5) {
           // document.getElementById("waterPrev").className = "orb-pic-container water water-4";
            color = "hue:0 saturation:1.0 brightness:1.0"
        }
    } else {
        if (relative <= .5) {
           // document.getElementById("elecPrev").className = "orb-pic-container electricity electric-0";
            color = "hue:180 saturation:1.0 brightness:1.0"
        }
        if (relative > .5 && relative < .8) {
           // document.getElementById("elecPrev").className = "orb-pic-container electricity electric-1";
            color = "hue:210 saturation:0.14 brightness:1.0"
        }
        if (relative >= .8 && relative <= 1.2) {
           // document.getElementById("elecPrev").className = "orb-pic-container electricity electric-2";
            color = "hue:300 saturation:1.0 brightness:1.0"
        }
        if (relative > 1.2 && relative < 1.5) {
            //document.getElementById("elecPrev").className = "orb-pic-container electricity electric-3";
            color = "hue:287 saturation:0.81 brightness:1.0"
        }
        if (relative >= 1.5) {
           // document.getElementById("elecPrev").className = "orb-pic-container electricity electric-4";
            color = "hue:350 saturation:1.0 brightness:1.0"
        }
    }
    return color;
}