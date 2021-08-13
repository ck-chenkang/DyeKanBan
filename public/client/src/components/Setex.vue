<template>
  <div class="kanban-container">
    <div class="kanban-head">
      <div class="kanban-head__left">
        <img class="kanban-head__left-logo" src="../assets/KEYENLINX.png" />
      </div>
      <div class="kanban-head__right">
        <div class="kanban-head__right-time" id="currentDate">
          <div>{{ nowDate }}</div>
        </div>
        <div class="kanban-head__right-alarm" id="call_board">
          <ul id="call_board_ul">
            {{
              alarmInfo[currentIndex]
            }}
          </ul>
        </div>
      </div>
      1
    </div>
    <div class="kanban-content">
      <div class="kanban-warning" v-if="errFlag">
        <h1>
          数据库连接失败，请检查中控系统电源或网络情况！！
        </h1>
      </div>
      <div class="kanban-content__devices" v-else>
        <div
          class="kanban-content__devices-card"
          v-for="(item, index) in devices"
          :key="index"
        >
          <div class="devices-card__head">
            <div class="devices-card__name">{{ item.MachineName }}</div>
            <div v-show="item.MachineStateInt == 1" class="devices-card__name"> 没有选择批次 </div>
            <div v-show="item.MachineStateInt == 2" class="devices-card__name"> 已选择批次 </div>
            <div v-show="item.MachineStateInt == 3" class="devices-card__name"> 运行 </div>
            <div v-show="item.MachineStateInt == 4" class="devices-card__name"> 停止 </div>
            <div v-show="item.MachineStateInt == 5" class="devices-card__name"> 手动 </div>
            <div v-show="item.MachineStateInt == 6" class="devices-card__name"> 批次结束 </div>            

            <div :class="[
                item.MachineStateInt == '3'
                  ? 'devics-card__status-online'
                  : item.OnLine == '0'
                  ? 'devics-card__status-offline'
                  : 'devics-card__status-standby',
              ]"
            ></div>
          </div>
          <div class="interval"></div>
          <div class="devices-card__content">
            <div class="devices-card__top">
              <div class="devices-card__top-left">
                <div class="devices-card__current-name">当前步骤</div>
                <div class="devices-card__current-step">
                  {{ item.zhuzhiling | zhuzhilingFilter }}
                </div>
              </div>
              <div class="devices-card__top-right">
                <div class="devices-card__current-name">主缸温度(°C)</div>
                <div class="devices-card__current-step">
                  {{ item.machinemaintemp | tempComp}}
                </div>
              </div>
            </div>
            <div class="devices-card__bottom">
              <div class="devices-card__top-left">
                <div class="devices-card__current-name">批次运行时间(min)</div>
                <div class="devices-card__current-step">
                  {{ item.BatchRunTime }}
                </div>
              </div>
              <div class="devices-card__top-right">
                <div class="devices-card__current-name">距离预计结束时间(min)</div>
                <div class="devices-card__current-step">
                  {{ item.TimeToEnd}}
                </div>
              </div>
            </div>
          </div>
          <!-- 天力现场用-->
          <!-- <div :class="[item.Main_Alarm != '' ? '' : 'hide']"> -->
          <!-- 实际测试用-->
          <div :class="[item.Main_Alarm != null ? '' : 'hide']">
            <div class="devices-alarm">
              <img class="devices-alarm__img" src="../assets/alarm-pop.png" />
              <div class="devices-alarm__text">{{ item.Main_Alarm | alarmComp}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
var _self,
  setNowTime,
  setAlarmInterval,
  callBoardCount = 0;

export default {
  name: "Hello",
  data() {
    return {
      nowDate: "",
      devices: "",
      err: "", //存放数据库未连接报警
      alarmInfo: [], //设备报警
      currentIndex: 0, //设备报警轮播的序号
      errFlag: "false", //数据库未连接报警的标志位
    };
  },
  created() {
    _self = this;
  },
  computed: {},
  filters: {
    judgeBatch: function (value) {
      if (!value.BatchName) {
        return "";
      } else {
        return value.BatchRunTime;
      }
    },
    zhuzhilingFilter: function (value) {
      // console.log(value.trim());
      if(value != null && value != undefined){
        return value.trim();
      }else{
        return "";
      }
    },
    tempComp :function(value){
      if(value != null && value != undefined && value != ""){
        return (value/66.6).toFixed(2);
      }else{
        return 0;
      }      
    },
    alarmComp:function(value){ //报警长度修剪
      if(value != null && value != undefined && value != ""){
        const strLen = value.length;
        var padChar = "";
        var len = 10;
        if (strLen > len){
          return value.substring(0, len);
        } else if (strLen < len){
          return value.padEnd(len, padChar);
        }else{
          return value;
        }
      }else{
        return "";
      }    
    }
 },
  watch: {},
  methods: {
    getKanbanDevices() {
      this.$axios
        .get("/api/search")
        .then((response) => {
          console.log("response.data.err ____" + response.data.err);

          if (response.data.err != undefined) {
            console.log("不应该进入这里");
            this.err = "DTR中控未打开";
            this.errFlag = true;
          } else {
            console.log("response.data.recordset————————" + response.data);
            console.log("this.errFlag————————" + this.errFlag);
            this.devices = response.data.recordset;
            this.errFlag = false;
            this.alarmInfo = response.data.alarmArr;
          }

          console.log(this.alarmInfo);
          // console.log(
          //   "typeof response.data.recordset[1].Main_Alarm: \n" +
          //     typeof response.data.recordset[1].Main_Alarm
          // ),
          // console.log(
          //   "response.data.recordset[1].Main_Alarm: \n" +
          //     response.data.recordset[1].Main_Alarm
          // )
        })
        .catch(function (error) {
          // 请求失败处理
          console.log(error);
        });
    },
    //获取当天日期
    nowTime() {
      var now = new Date();
      var year = now.getFullYear();
      var month = now.getMonth() + 1;
      var day = now.getDate();
      var hour = now.getHours();
      var minute =
        now.getMinutes() < 10 ? "0" + now.getMinutes() : now.getMinutes();
      var second =
        now.getSeconds() < 10 ? "0" + now.getSeconds() : now.getSeconds();
      this.nowDate =
        year +
        "/" +
        month +
        "/" +
        day +
        " " +
        hour +
        ":" +
        minute +
        ":" +
        second;
    },
  },
  mounted() {
    setNowTime = setInterval(function () {
      _self.nowTime();
      _self.getKanbanDevices();
    }, 1000);

    setAlarmInterval = setInterval(function () {
      if (_self.currentIndex >= _self.alarmInfo.length) {
        _self.currentIndex = 0;
      } else {
        _self.currentIndex++;
      }
      console.log("这个程序在执行");
    }, 2000);
  },
  beforeDestroy() {
    clearInterval(setNowTime);
  },
};
</script>

<style scoped>
.kanban-container {
  height: 1080px;
  width: 1920px;
}
/*看板头部*/
.kanban-head {
  height: 115px;
  width: 100%;
  background: rgba(34, 53, 98, 1);
  box-shadow: 0px 2px 12px 0px rgba(8, 28, 73, 1);
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.kanban-head__left {
  margin-left: 24px;
}

.kanban-head__left-logo{
  width: 50%;
  height: 30%;
}


.kanban-head__right {
  margin-right: 24px;
  width: 74%;
  text-align: right;
}
.kanban-head__right-time {
  font-size: 36px;
  font-weight: 500;
  font-family: Arial-BoldMT, Arial;
  color: rgba(255, 255, 255, 1);
  letter-spacing: 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
/*报警公告栏*/
.kanban-head__right-alarm {
  font-size: 20px;
  font-family: MicrosoftYaHei;
  color: rgba(255, 218, 43, 1);
  letter-spacing: 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  height: 70px;
  line-height: 5px;
}
li {
  list-style: none;
}

/*看板主体内容*/
.kanban-content {
  box-sizing: border-box;
  padding: 0 0 16px 16px;
}
.kanban-content__devices {
  display: flex;
  flex-wrap: wrap;
  overflow: auto;
}
/*设备卡片*/
.kanban-content__devices-card {
  width: 460px;
  height: 214px;
  background: rgba(34, 53, 98, 1);
  border-radius: 12px;
  margin: 16px 16px 0 0;
  position: relative;
}

/*设备卡片-头部*/
.devices-card__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 65px;
  line-height: 34px;
}
.devices-card__name {
  margin-left: 16px;
  font-size: 30px;
  font-family: Arial-BoldMT, Arial;
  font-weight: 600;
  color: rgba(255, 255, 255, 1);
}

/*设备状态*/
/*在线*/
.devics-card__status-online {
  margin-right: 24px;
  width: 24px;
  height: 24px;
  background: rgba(82, 196, 26, 1);
  box-shadow: 0px 0px 20px 0px rgba(82, 196, 26, 1);
  border-radius: 50%;
  animation-name: online;
  animation-duration: 1.5s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  animation-direction: alternate;
}
@keyframes online {
  from {
    /*opacity: 1;*/
    box-shadow: 0px 0px 20px 5px rgba(82, 196, 26, 1);
  }
  to {
    /*opacity: 0.8;*/
    box-shadow: 0px 0px 0px 0px rgba(82, 196, 26, 0.4);
  }
}
/*待机*/
.devics-card__status-standby {
  margin-right: 24px;
  width: 24px;
  height: 24px;
  background: rgba(45, 126, 255, 1);
  /*box-shadow:0px 0px 20px 0px rgba(45,126,255,1);*/
  border-radius: 50%;
}
/*离线*/
.devics-card__status-offline {
  margin-right: 24px;
  width: 24px;
  height: 24px;
  background: rgba(255, 255, 255, 1);
  border-radius: 50%;
  opacity: 0.25;
}

/*设备卡片-内容*/
.devices-card__content {
  margin: 12px 16px;
}
.devices-card__top {
  display: flex;
  margin-bottom: 12px;
}
.devices-card__top-left {
  width: 60%;
}
.devices-card__top-right {
  width: 40%;
}
.devices-card__bottom {
  display: flex;
}
.devices-card__current-name {
  margin-bottom: 6px;
  font-size: 16px;
  font-family: MicrosoftYaHei;
  color: #7f90a3;
  line-height: 21px;
}
.devices-card__current-step {
  font-size: 24px;
  font-family: ArialMT;
  color: rgba(255, 255, 255, 0.85);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 28px;
}

/*间隔线*/
.interval {
  height: 1px;
  background: rgba(255, 255, 255, 0.05);
}

/*发生报警*/
.devices-alarm {
  height: 78px;
  width: 100%;
  bottom: 0;
  background: rgba(209, 42, 42, 1);
  border-radius: 0px 0px 12px 12px;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  /*animation-name: alarm;*/
  /*animation-duration: 0.2s;*/
  /*animation-timing-function: linear;*/
  /*animation-iteration-count: infinite;*/
  /*animation-direction: alternate;*/
}
@keyframes alarm {
  from {
    opacity: 1;
    /*box-shadow:0px 0px 20px 10px rgba(209,42,42,1);*/
  }
  to {
    opacity: 0.1;
    /*box-shadow:0px 0px 0px 0px rgba(209,42,42,0.4);*/
  }
}
.devices-alarm__img {
  height: 38px;
  width: 38px;
  color: #ffffff;
  margin: 0 10px 3px 0;
  animation-name: alarm;
  animation-duration: 0.2s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  animation-direction: alternate;
}
.devices-alarm__text {
  font-size: 30px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: rgba(255, 255, 255, 1);
  margin-right: 25px;
  animation-name: alarm;
  animation-duration: 0.2s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  animation-direction: alternate;
}

#nowDate {
  font-family: ArialMT;
  font-size: 36px;
}
/*隐藏*/
.hide {
  display: none;
}

.kanban-warning {
  text-align: center;
  font-size: 30px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: rgba(255, 0, 0, 1);
  margin-right: 25px;
}
</style>
