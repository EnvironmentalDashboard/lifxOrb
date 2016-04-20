// Methods that we can call from client to do cool things.

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

