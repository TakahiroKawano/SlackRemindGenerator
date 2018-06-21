<template>
  <div>
    <h1>Slack Remind Generator</h1>
    <h2>Whom? <span class="description">(@someone, #channel or me)</span></h2>
    <input type="text" v-model="whom">
    <h2>What?</h2>
    <input type="text" v-model="what">
    <h2>When?</h2>
    <div id="when">
      <div id="date">
        <datepicker
          v-model="date"
          format="MM/dd/yyyy"
          placeholder="Date"
          clear-button
          :disabled-dates="{ to: new Date(Date.now() - 8640000) }">
        </datepicker>
      </div>
      <div id="time">
        <select v-model="hour">
          <option value="">Hour</option>
          <option v-for="hour in hours" v-bind:key="hour">
            {{ hour }}
          </option>
        </select>
        <b>:</b>
        <select v-model="minute">
          <option value="">Minute</option>
          <option v-for="minute in minutes" v-bind:key="minute">
            {{ minute }}
          </option>
        </select>
      </div>
    </div>
    <div class="clear"></div>
    <div id="repeat">
      <h2>Repeat?</h2>
      <div id="repeatItemList">
        <ul>
          <li v-for="repeatItem in repeatItems" :key="repeatItem.Id">
            <label v-bind:for="repeatItem">
              <input type="radio"
                    v-bind:id="repeatItem"
                    v-bind:value="repeatItem"
                    v-model="repeat"
                    v-bind:checked="repeatItem == 'None'">
              {{ repeatItem }}
            </label>
          </li>
        </ul>
      </div>
    </div>
    <div class="clear"></div>
    <div id="generatedRemind">
      <h2>Generated Remind</h2>
      <div id="remindCommand">
        <label>{{ generatedRemind }}</label>
      </div>
      <button class="btn"
        v-on:click="copy"
        data-clipboard-target="#remindCommand">
        Copy to clipboard
      </button>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import moment from "moment";
import Datepicker from 'vuejs-datepicker';

export default {
  name: "SlackRemindGenerator",
  data() {
    return {
      whom: "",
      what: "",
      date: "",
      hour: "",
      minute: "",
      remindDate: "",
      repeatItems: [
        "None",
        "EveryDay",
        "EveryWeek",
        "Biweekly",
        "EveryMonth",
        "EveryYear"
      ],
      repeat: "None",
      hours: [
        "00",
        "01",
        "02",
        "03",
        "04",
        "05",
        "06",
        "07",
        "08",
        "09",
        "10",
        "11",
        "12",
        "13",
        "14",
        "15",
        "16",
        "17",
        "18",
        "19",
        "20",
        "21",
        "22",
        "23"
      ],
      minutes: [
        "00",
        "10",
        "20",
        "30",
        "40",
        "50"
      ]
    };
  },
  components: {
    Datepicker
  },
  computed: {
    generatedRemind: function() {
      var remindDate = "";
      var dayOfWeek = "";
      var dayDo = "";
      if (this.date) {
        remindDate = "on " + moment(this.date).format("MM/DD/YYYY");
        dayOfWeek = moment(this.date).format("dddd");
        dayDo = moment(this.date).format("Do");
      } else {
        remindDate = "";
        dayOfWeek = moment().format("dddd");
        dayDo = moment().format("Do");
      }

      var remindTime = "";
      if(this.hour && this.minute) {
        Number(this.hour) < 12 ?
          remindTime = this.hour + ":" + this.minute + "am" :
          remindTime = String(Number(this.hour) - 12) + ":" + this.minute + "pm";
        remindTime = "at " + remindTime;
      }

      var repeat;
      switch (this.repeat) {
        case "None":
          repeat = "";
          break;
        case "EveryDay":
          repeat = "every Day";
          break;
        case "EveryWeek":
          repeat = "every " + dayOfWeek;
          break;
        case "Biweekly":
          repeat = "every other " + dayOfWeek;
          break;
        case "EveryMonth":
          remindDate = ""
          repeat = "on the " + dayDo + " every Month";
          break;
        case "EveryYear":
          repeat = "every Year";
          break;
        default:
          repeat = "";
          break;
      }

      return (
        "/remind " +
        this.whom +
        " " +
        this.what +
        " " +
        remindDate +
        " " +
        remindTime +
        " " +
        repeat
      );
    }
  },
  methods: {
    copy: function() {
    console.log(this.time)
      var remindCommand = document.getElementById("remindCommand");
      var copyFrom = document.createElement("textarea");
      copyFrom.textContent = remindCommand.innerText;
      var bodyElm = document.getElementsByTagName("body")[0];
      bodyElm.appendChild(copyFrom);
      copyFrom.select();
      document.execCommand("copy");
      bodyElm.removeChild(copyFrom);
    }
  }
};
</script>
