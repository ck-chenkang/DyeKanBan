var fs = require('fs');
var path = require('path');


var mypath = path.join(__dirname, './devices.txt');

var data = fs.readFileSync(mypath, 'utf-8');
var myarray = data.split("\r\n");

var str1 = "RTRIM(";
var str2 = ")";
var str3 = ",";
var str4 = "' '";
var midstr = "CONCAT(";
myarray.forEach(function(value, index){
    midstr += str1;
    midstr += value;
    midstr += str2;
    midstr += str3;
    midstr += str4;
    midstr += str3;
});
midstr += str2;
console.log(midstr);


// fs.appendFileSync(path.join(__dirname, 'my.txt'), str);