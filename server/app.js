/**
 * Created by stevemeyer on 4/15/16.
 */
Meteor.methods({
    insertOrb: function (orbInfo) {
        water = orbInfo[0];
        elec = orbInfo[1];
        selector = orbInfo[2];
        building = orbInfo[3];
        Orbs.insert({building: building, selector: selector, water: water, elec: elec})
    },
    removeOrb: function (orb) {
        Orbs.remove(orb);
    }
});