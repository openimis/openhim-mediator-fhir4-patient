'use strict'
var request = require('request');
var auth = require('./auth');
var _ = require('lodash');
const dotenv = require("dotenv");
dotenv.config();

function patientSync(){
     request({
        url: process.env.OPENIMIS_URL+'/Patient/',
        method: 'GET',
        headers : {
          "Authorization" : auth.user
        },
      }, function(error, response, body){
        let res = JSON.parse(body);
        let page_size = Math.ceil(res.total/10)
        for(var i =1;i <= page_size;i++){
          request({
            url: process.env.OPENIMIS_URL+'/Patient/?page-offset='+i,
            method: 'GET',
            headers : {
              "Authorization" : auth.user
            },
          }, function(error, response, body){
            let res = JSON.parse(body);
            res.entry.forEach(element => {
              let chf_id = element.resource.identifier.find(obj => obj.type.coding[0].code=='SB').value
              console.log(chf_id)
              request({
                url: process.env.SOSYS_URL+'/members/memberlist/?chf_id='+chf_id,
                method: 'GET',
              }, function(error, response, body){
                let res = JSON.parse(response.body)
                res.results.forEach(element => {
                });
              });
             });
          });
        }
      });
  
}
exports.patientSync = patientSync