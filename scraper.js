const cheerio = require('cheerio');
const request = require('request');
//Database requirements
const express = require('express')
const app = express();
const bodyParser = require('body-parser');
const knexConfig = require('./knexfile');
const knex = require('knex')(knexConfig);
const bookshelf = require('bookshelf')(knex);
var CronJob = require('cron').CronJob;

//Bookshelf model for Sailings
const Sailing = bookshelf.Model.extend({
    tableName: 'sailings',
});

// Bookshelf model for current conditions.
const CurrentCondition = bookshelf
    .Model
    .extend({
        // tell it the name of the table
        tableName: 'current_conditions'
    });

conditionsData = (tableNum) => {
    let url = "http://orca.bcferries.com:8080/cc/marqui/at-a-glance.asp";

    request(url, function (error, response, body) {
        if (!error) {

            let $ = cheerio.load(body);
            let ferryRoute = [];
            let departure = '';
            let arrival = '';
            let sailing = '';
            let percentFull = '';
            let carWaits = '';
            let oversizeWaits = '';
            let nextSailing = '';
            let nextPercentFull = '';

            $('#tblLayout > tbody > tr > td > table > tbody > tr > td > table:nth-child(' + tableNum + ') > tbody > tr:nth-child(2) > td:nth-child(1)').each(function () {
                ferryRoute = ($(this).text()).split(' to ');
                departure = ferryRoute[0];
                arrival = ferryRoute[1];
            });

            $('#tblLayout > tbody > tr > td > table > tbody > tr > td > table:nth-child('+ tableNum +') > tbody > tr:nth-child(2) > td:nth-child(2) > div > table > tbody > tr:nth-child(1) > td:nth-child(1) > a').each(function () {
                sailing = ($(this).text())
            });

            $('#tblLayout > tbody > tr > td > table > tbody > tr > td > table:nth-child('+ tableNum +') > tbody > tr:nth-child(2) > td:nth-child(2) > div > table > tbody > tr:nth-child(1) > td:nth-child(2)').each(function () {
                percentFull = ($(this).text())
            });

            $('#tblLayout > tbody > tr > td > table > tbody > tr > td > table:nth-child('+ tableNum +') > tbody > tr:nth-child(2) > td:nth-child(3) > div').each(function () {
                carWaits = ($(this).text())
            });

            $('#tblLayout > tbody > tr > td > table > tbody > tr > td > table:nth-child('+ tableNum +') > tbody > tr:nth-child(2) > td:nth-child(4) > div').each(function () {
                oversizeWaits = ($(this).text())
            });

            $('#tblLayout > tbody > tr > td > table > tbody > tr > td > table:nth-child('+ tableNum +') > tbody > tr:nth-child(2) > td:nth-child(2) > div > table > tbody > tr:nth-child(2) > td:nth-child(1) > a').each(function () {
                nextSailing = ($(this).text())
            });

            $('#tblLayout > tbody > tr > td > table > tbody > tr > td > table:nth-child('+ tableNum +') > tbody > tr:nth-child(2) > td:nth-child(2) > div > table > tbody > tr:nth-child(2) > td:nth-child(2)').each(function () {
                nextPercentFull = ($(this).text())
            });

            const cond_1 = new CurrentCondition({
                departure_terminal: departure,
                arrival_terminal: arrival,
                sailing_time: sailing,
                percent_full: percentFull,
                car_waits: carWaits,
                oversize_waits: oversizeWaits,
                next_sailing_time: nextSailing,
                next_percent_full: nextPercentFull
            });

            cond_1.save().then(conditions => {
                    console.log('Current conditions: ' + departure +' updated')
                });
        } else {
            console.log("We've encountered an error: " + error);
        }
    });
}

sailingData = (tableNum) => {
    let url = "http://orca.bcferries.com:8080/cc/marqui/actualDepartures.asp";
    
    request(url, function (error, response, body) {
        if (!error) {

            let $ = cheerio.load(body);
            let ferryRoute = [];
            let departure = '';
            let arrival = '';
            let date = ''
            let sailings = [];

            $('#tblLayout > tbody > tr > td > table > tbody > tr > td > table:nth-child('+ tableNum +') > tbody > tr > td:nth-child(1) > span').each(function () {
                ferryRoute = ($(this).text()).split('Sailing time:');
                ferryRoute = ferryRoute[0].split(' to ');
                departure = ferryRoute[0];
                arrival = ferryRoute[1];
            });

            $('#tblLayout > tbody > tr > td > table > tbody > tr > td > table:nth-child('+ tableNum +') > tbody > tr > td.titleSmInv > span').each(function () {
                date = $(this).text();
            });
            

            // loop the table numbers until you return an error

            $('#tblLayout > tbody > tr > td > table > tbody > tr > td > table:nth-child('+ (tableNum + 1) +') > tbody > tr').each(function (i) {
                if(i > 0) {
                    //console.log($(this).text())
                    sailings = $(this).text().split('\n');
                    sailings = sailings.map(sailing => {
                        sailing = sailing.trim();
                        return sailing;
                    });
                    sailings = sailings.filter(string => {
                        return string !== '';
                    })

                    if (sailings[2] === 'Cancelled') {
                        sailings[2] = null;
                        sailings[4] = 'Cancelled'
                    }

                    const sailingData = new Sailing({
                        sailing_date: date,
                        departure_terminal: departure,
                        arrival_terminal: arrival,
                        sailing_time: sailings[1],
                        vessel: sailings[0],
                        actual_departure: sailings[2],
                        eta: sailings[3],
                        status: sailings[4]
                    })
                    
                    const sailingUpdate = {
                        actual_departure: sailings[2] || null,
                        eta: sailings[3] || null,
                        status: sailings[4] || null
                    }

                    Sailing.where({
                            sailing_date: date,
                            departure_terminal: departure,
                            arrival_terminal: arrival,
                            sailing_time: sailings[1],
                            vessel: sailings[0],
                        })
                        .fetch()
                        .then(sailing => {
                            if (!sailing) {
                                sailingData.save()
                                .then(console.log('Sailing Saved from: ' + departure))
                                .catch(error => {
                                    console.log("1", error)
                                })
                            } else {
                                new Sailing({id: sailing.attributes.id})
                                    .save(sailingUpdate, {patch: true})
                                .then(console.log('sailing from: ' + departure +' updated'))
                                .catch(error => {
                                    console.log("2", error)
                                })
                            }
                        })
                        .catch(error => {
                            console.log(error)
                        })
                };
            });

        } else {
            console.log("We've encountered an error: " + error);
        }
    });
}

new CronJob('0 */5 6-24 * * *', function() {
    sailingData(6);
    sailingData(26);
    sailingData(34);
    sailingData(42);
    conditionsData(8);
    conditionsData(13);
    conditionsData(23);
    conditionsData(28);
      }, null, true, 'America/Los_Angeles');