var express = require('express');
var router = express.Router();
var db = require('./db');
var moment = require('moment');

/* GET 设备相关数据 */
router.get('/', function (req, res, err) {

	//测试sql
	var sql = `SELECT
	ma.Machine AS MachineName,
	ma.OnlineState as OnLine,
	ma.RunState as MachineStateInt,
	ma.InfoWord1 as machinemaintemp,
	ma.TimeToEnd,
	ma.RunTime as BatchRunTime,
	dy.Dyelot as BatchName,
	fu.functiontext as zhuzhiling,
	al.AlarmText as Main_Alarm
FROM
	MachineStatus ma
	LEFT OUTER JOIN Dyelots dy ON ma.DyelotRefNo = dy.DyelotRefNo
	LEFT OUTER JOIN FunctionList fu ON ma.[Function] = fu.FunctionNo
	LEFT OUTER JOIN AlarmList al ON ma.Alarm = al.AlarmNo 
	AND al.GroupNo = 1`;

	// console.log(sql);
	db.sqlexe(sql, function (err, result) {
		if (err) {
			console.log(err);
			res.send({"err":"数据库连接信息错误"});
			return;
		}
		var array = Array.from(result.recordset);
		var alarmArr = [];

		array.forEach(async function (value, index) {
			if (value.Main_Alarm != null) { //测试用
			// if (value.Main_Alarm != "") { //现场用
				alarmArr.push(moment().format('MM-DD hh:mm:ss') +"   " + value.MachineName.trim() + " " + value.Main_Alarm.trim())
			}
		});

		result.alarmArr = alarmArr;
		

		// console.log(result);
		res.send(result);

	});
});

module.exports = router;
