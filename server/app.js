/**
 * Created by stevemeyer on 4/15/16.
 */
Meteor.methods({
    insertOrb: function (orbInfo) {
        meterSelected = orbInfo[0];
        selector = orbInfo[1];
        building = orbInfo[2];
        mostrecentPoint = orbInfo[3];
        Orbs.insert({building: building, selector: selector, meter: meterSelected, lastPoint: mostrecentPoint})
    },
    removeOrb: function (orb) {
        Orbs.remove(orb);
    }
});