var express = require("express");
var bodyParser = require('body-parser');
var rest = require("./rest");
var fs = require('fs');
var app = express();
var jsonParser = bodyParser.json();
const config = require("./config.js");

app.post('/hotel', jsonParser, function(req, res) {
  var requestObject = {
    service : "/v1.0.0/shop/hotels?mode=avail",
    query : {
      "GetHotelAvailRQ":{
        "SearchCriteria":{
          "GeoRef":{
            "RefPoint":{
              "CountryCode":req.body.country,
              "RefPointType":"5",
              "ValueContext":"NAME",
              "Value":req.body.poi
            },
            "Radius":20.0,
            "UOM":"MI",
            "Category": "HOTEL"
          },
          "RateInfoRef":{
            "CurrencyCode":"USD",
            "StayDateRange":{
              "StartDate":"2016-10-21",
              "EndDate":"2016-10-22"
            },
            "GuestCount":{
              "Count":1
            }
          },
          "HotelPref":{

          },
          "ImageRef":{
            "Type":"SMALL",
            "LanguageCode":"EN"
          }
        }
      }
    },
  };
  rest.post2(requestObject, res)
});

var google = require('googleapis');
var key = require(config['GOOGLE_KEY']);
var jwtClient = new google.auth.JWT(key.client_email, null, key.private_key, ['https://www.googleapis.com/auth/cloud-platform'], null);

app.post('/imgtext', jsonParser, function(req, res) {
  jwtClient.authorize(function(err, tokens) {
    if (err) {
      console.log(err);
      return;
    }
    var requestObject = {
      query : {
        "document":{
          "type":"PLAIN_TEXT",
          "content": req.body.alt
        },
        "encodingType":"UTF8"
      },
      url : "https://language.googleapis.com/v1beta1/documents:analyzeEntities"
    };
    rest.postWithAuth(requestObject, res, tokens.access_token)
  });
});

app.listen(1337, function () {});
