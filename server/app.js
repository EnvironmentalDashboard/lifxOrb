/**
 * Created by stevemeyer on 4/15/16.
 */

token = "cbb30e4f1d36b2736c162399d570bb9803b3eb8158d303df5bd00fcfa9ccdee1";
avgTime = 7;
var now = 0;
var nowISO = 0;
var then = 0;
var thenISO = 0;

setInterval(function() {
    //Get some dates
    now = new Date();
    nowISO = now.toISOString();
    then = new Date();
    then.setDate(then.getDate()-avgTime);
    thenISO = then.toISOString();

    main();
}, 10 * 1000);

function main(){
   // var orbs = getOrbsWrapAsync();
   // console.log(orbs);
}

function getOrbsWrapAsync() {
    var convertAsyncToSync  = Meteor.wrapAsync( getOrbs ),
        resultOfAsyncToSync = convertAsyncToSync( convertAsyncToSync);
    return resultOfAsyncToSync;
}

function getOrbs(){
    var cursor = Orbs.find();
    var orb;
    var list;
    while (cursor.hasNext()) {
        orb = cursor.next();
        list.push(orb);
    }
    return list;
}



Meteor.methods({
    insertOrb: function (orbInfo) {
        var water = orbInfo[0];
        var elec = orbInfo[1];
        var selector = orbInfo[2];
        var building = orbInfo[3];
        Orbs.insert({building: building, selector: selector, water: water, elec: elec})
    },
    removeOrb: function (orb) {
        Orbs.remove(orb);
    },

});

