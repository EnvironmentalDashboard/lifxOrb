/**
 * Created by steve on 1/15/16.
 * Methods we can call from anywhere to make api calls
 */

//what you know about security lol
client_id = 'vtmF5VoO-CmrB?eQHBoMNNAvAU!faAwl2O98!2Ua';
client_secret = 'q!gywR70Vm0TUX6=8mdFiQE3eSVb=qzUh=n2NAr2U4.E6Uu165xwP3JPZWOm-_8WXwj9wfGGC8LK@25Pa8Pc_sj@XvNc3Q4A4wNzsRNDGpDMV7w@yVn-JNnL!YZ33T5.';
grant_type = 'password';
username = 'smeyer@oberlin.edu';
password = 'ironsail1';
meter_url = 'https://api.buildingos.com/meters/';
token_url = 'https://api.buildingos.com/o/token/';
refresh_url = 'https://api.buildingos.com/o/refresh/';
building_url = 'https://api.buildingos.com/buildings/';

Meteor.methods({
    getToken: function () {
        //Build url, make call, get money
        var url = token_url + "?client_id=" + client_id + "&client_secret=" + client_secret + "&username=" + username + "&password=" + password + "&grant_type=" + grant_type;
        var json = HTTP.post(url);
       // Token.insert({token : json.data['access_token']});
        return json.data['access_token'];
    },

    makeCall: function (start, end, point, res) {
        //Gets token
        var token = Meteor.call("getToken");

        //Checks to see if any params are null
        start = typeof start !== 'undefined' ? start : "";
        end   = typeof end   !== 'undefined' ? end   : "";
        point = typeof point !== 'undefined' ? point : "";
        res   = typeof res   !== 'undefined' ? res   : "";

        //Generate Url
        var parameters = [];
        var qs = [];
        if (start != 0){
            parameters["start"] = start;
        }
        if (end   != 0){
            parameters["end"]   = end;

        }
        if (res   != 0){
            parameters["resolution"] = res;

        }
        for (var d in parameters)
            qs.push(encodeURIComponent(d) + "=" + encodeURIComponent(parameters[d]));
        var url = meter_url + point + '/data?' + qs.join("&");

        //Make the call
        var results = HTTP.get(url,
            {headers:{
                'Content-Type': 'application/json',
                'Authorization' : 'Bearer ' + token}
            }
        );

        //Organize the data - Create a 2-D array where index 0 is the array holding the values
        //and where index 1 is the array holding the dates. Jank, but plays nicer with c3.
        var values  = [];
        values[0] = 'value';
        for(var i=1; i < results.data['data'].length; i++) {
            values[i] = results.data['data'][i]['value']
        }
        var date  = [];
        date[0] = 'date';
        for(var i=1; i < results.data['data'].length; i++) {
            date[i] = results.data['data'][i]['localtime'].slice(0,19)
        }
        both = [date,values];
        return both;
    },

    //method thats gets the list of buildings by means of lucid api. API url is hard coded for Oberlin college
    getBuildings: function(){
        //for testing
        var token =  Meteor.call("getToken");

        var url = building_url + '?per_page=100';

        //Make the call
        var building = HTTP.call('GET', url, { headers: {
            'Content-Type': 'application/json',
            'Authorization' : 'Bearer ' + token}
        });

        //Create list of buildings
        var list  = [];
        for(var i=0; i < building.data['total_count']; i++){
            var obj = {
                name: building.data['data'][i]['name'],
                meters: building.data['data'][i]['meters']
            };
            list.push(obj);
        }
        return list;
    }
});
