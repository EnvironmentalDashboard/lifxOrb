/**
 * Created by stevemeyer on 4/15/16.
 */
Orbs = new Mongo.Collection( 'orbs' );

Orbs.allow({
    insert: function() { return false; },
    update: function() { return false; },
    remove: function() { return false; }
});

Orbs.deny({
    insert: function() { return true; },
    update: function() { return true; },
    remove: function() { return true; }
});