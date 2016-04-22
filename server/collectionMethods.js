// Methods that we can call from client to do cool things.

Meteor.methods({
    insertOrb: function (orbInfo) {
        var water = orbInfo[0];
        var elec = orbInfo[1];
        var selector = orbInfo[2];
        var building = orbInfo[3];
        var waterColor = "hue:180 saturation:1.0 brightness:1.0";
        var elecColor = "hue:120 saturation:0.6 brightness:1.0";
        var waterPrev = "orb-pic-container water water-0";
        var elecPrev = "orb-pic-container electricity electric-0";
        Orbs.insert({building: building, selector: selector, water: water, elec: elec, waterColor:waterColor, elecColor:elecColor,
                    waterPrev:waterPrev, elecPrev:elecPrev})
    },
    removeOrb: function (orb) {
        Orbs.remove(orb);
    }
});

