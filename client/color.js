/**
 * Created by steve on 1/26/16.
 */

token = "cbb30e4f1d36b2736c162399d570bb9803b3eb8158d303df5bd00fcfa9ccdee1";
avgTime = 7;

setInterval(function() {
    //Get some dates
    now = new Date();
    nowISO = now.toISOString();
    then = new Date();
    then.setDate(then.getDate()-avgTime);
    thenISO = then.toISOString();

    //Mmmm cookies
    water = Cookie.get("water");
    elec = Cookie.get("electricity");

    //main(water, elec);
}, 10 * 1000);

function main(water, elec){

    Meteor.call('makeCall', 0, 0, water, 'live', function(error, results) {
        if (error) {
            console.log(error);
        } else {
          //  console.log("water");
            Meteor.call('makeCall', thenISO, nowISO, water, 'hour', function(error, secondResults) {
                if (error){
                    console.log(error);
                } else{
                    var current  = findAverageCurrentUsage(5,results);
                    var typical = typicalUsage(secondResults);
                    setColor(current,typical,false);
                }
            });
        }
    });

    Meteor.call('makeCall', 0, 0, elec, 'live', function(error, results) {
        if (error) {
            console.log(error);
        } else {
       //     console.log("elec");
            Meteor.call('makeCall', thenISO, nowISO, elec, 'hour', function(error, secondResults) {
                if (error){
                    console.log(error);
                } else{
                    var current  = findAverageCurrentUsage(5,results);
                    var typical = typicalUsage(secondResults);
                    setColor(current,typical,true);
                }
            });
        }
    });
}

function setColor(current, typical, isElec){
    var relative = current/typical;

    var color;
    var colorWater;
    var elec  = document.getElementById("electric");
    var water = document.getElementById("water");

    headers = {
        "Authorization": "Bearer %s" % token
    };

    if(relative <= .5){
        if(isElec == true) {
            color = 0;
            elec.className = "electric-"+color;
            data = {
                "period": 1,
                "cycles": 100,
                "color": "green"
            }
        } else{
            colorWater = 0;
            water.className = "water-"+colorWater;
            data = {
                "period": 1,
                "cycles": 100,
                "color": "green"
            }
        }
    }
    if(relative > .5 && relative < .8){
        if(isElec == true) {
            color = 1;
            elec.className = "electric-"+color;
            data = {
                "period": 1,
                "cycles": 100,
                "color": "#adff2f"
            }
        } else{
            colorWater = 1;
            water.className = "water-"+colorWater;
            data = {
                "period": 1,
                "cycles": 100,
                "color": "#adff2f"
            }
        }
    }
    if(relative >= .8 && relative <= 1.2){
        if(isElec == true) {
            color = 2;
            elec.className = "electric-"+color;
            data = {
                "period": 1,
                "cycles": 100,
                "color": "yellow"
            }
        } else{
            colorWater = 2;
            water.className = "water-"+colorWater;
            data = {
                "period": 1,
                "cycles": 100,
                "color": "yellow"
            }
        }
    }
    if(relative > 1.2 && relative < 1.5){
        if(isElec == true) {
            color = 3;
            elec.className = "electric-"+color;
            data = {
                "period": 1,
                "cycles": 100,
                "color": "orange"
            }
        } else{
            colorWater = 3;
            water.className = "water-"+colorWater;
            data = {
                "period": 1,
                "cycles": 100,
                "color": "orange"
            }
        }
    }
    if(relative >= 1.5){
        if(isElec == true) {
            color = 4;
            elec.className = "electric-"+color;
            data = {
                "period": 1,
                "cycles": 100,
                "color": "red"
            }
        } else{
            colorWater = 4;
            water.className = "water-"+colorWater;
            data = {
                "period": 1,
                "cycles": 100,
                "color": "red"
            }
        }
    }
  //  console.log(color + " " + colorWater);

    url =  'https://api.lifx.com/v1/lights/d073d51241d2/effects/pulse';
    var results = HTTP.post(url,
        {headers:{
            'Content-Type': 'application/json',
            'Authorization' : 'Bearer ' + token}
        ,
        data:{
            'period': 1,
            'cycles': 100,
            'color': 'red'}
        }
    );
    console.log(results);
    //HTTP.call( 'POST', 'https://api.lifx.com/v1/lights/d073d51241d2/effects/pulse', {
    //    data: {
    //        color: data["color"],
    //        cycles: data["cycles"],
    //        period: data["period"]
    //    },
    //    headers: {
    //        "Authorization": "Bearer %s" % token
    //    }
    //}, function( error, response ) {
    //    if ( error ) {
    //        console.log( error );
    //    } else {
    //        console.log( response );
    //    }
    //});

      //HTTP.post('https://api.lifx.com/v1/lights/d073d51241d2/effects/breathe',data,headers,function(error, response){
      //    if ( error ) {
      //    console.log( error );
      //} else {
      //    console.log( response );
      //}});

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