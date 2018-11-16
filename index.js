//var list = document.querySelectorAll(".motor-sport-results, .msr_season_driver_results")[1].getElementsByTagName("tbody")[0].childNodes;

var express = require('express');
var axios = require('axios');
var bodyParser = require('body-parser');
var cheerio = require('cheerio');
var app = express();

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

var topTenDrivers = [];

app.get('/f1-top-drivers', function(req, resp){
    getDriverData(resp);
});
app.get('/f1-top-teams', function(req, resp){
    getTeamData(resp);
});

function getTeamData(resp){
    axios.all([
        axios.get('https://www.f1-fansite.com/f1-results/2018-f1-championship-standings/')
      ]).then(axios.spread((response) => {
        console.log("Starting to parse data.");
        const $ = cheerio.load(response.data);
        topTenDrivers = [];
          var ct = $('.motor-sport-results, .msr_season_driver_results table').each(
            (i, elm) => {
                //console.log(i + elm.tagName);
                if(i==3){
                    var tbody = $('tbody tr', elm);
                    rank = 1;
                    tbody.each((j,e)=>{
                        if(j == 10){
                            return false;
                        }
                        if(j%2 == 0){
                        var name = $('td a', e).attr('title');
                        let obj = {};
                        obj.rank = rank++;
                        obj.name = name;
                        console.log(obj);
                        topTenDrivers.push(obj);
                        }
                    });
                }
            }
          );
          resp.send(topTenDrivers);
      })).catch(error => {
        "Site Structure Changed. Error Parsing data."
      });
}

function getDriverData(resp){
    axios.all([
        axios.get('https://www.f1-fansite.com/f1-results/2018-f1-championship-standings/')
      ]).then(axios.spread((response) => {
        console.log("Starting to parse data.");
        const $ = cheerio.load(response.data);
        topTenDrivers = [];
          var ct = $('.motor-sport-results, .msr_season_driver_results table').each(
            (i, elm) => {
                //console.log(i + elm.tagName);
                if(i==1){
                    var tbody = $('tbody tr', elm);
                    tbody.each((j,e)=>{
                        if(j == 10){
                            return false;
                        }
                        var name = $('td a', e).attr('title');
                        let obj = {};
                        obj.rank = j+1;
                        obj.name = name;
                        console.log(obj);
                        topTenDrivers.push(obj);
                    });
                }
            }
          );
          resp.send(topTenDrivers);
      })).catch(error => {
        "Site Structure Changed. Error Parsing data."
      });
}
var server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port
    
    console.log("Example app listening at http://%s:%s", host, port)
 });



  

    
