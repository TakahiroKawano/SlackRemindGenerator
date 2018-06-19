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
        <label>
          <input type="date"
            v-model="date"
            v-bind:min="datetimeMinFormat"
            v-bind:max="datetimeMaxFormat">
        </label>
      </div>
      <div id="time">
        <label>
          <input type="time"
            v-model="time"
            step="600">
        </label>
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

export default {
  name: "SlackRemindGenerator",
  data() {
    return {
      whom: "",
      what: "",
      date: "",
      time: "",
      remindDate: "",
      datetimeMinFormat: moment().format("YYYY-MM-DD"),
      datetimeMaxFormat: moment().format("2700-12-31"),
      repeatItems: [
        "None",
        "EveryDay",
        "EveryWeek",
        "Biweekly",
        "EveryMonth",
        "EveryYear"
      ],
      repeat: "None"
    };
  },
  components: {},
  computed: {
    generatedRemind: function() {
      var remindDate;
      var dayOfWeek;
      var dayDo;
      if (this.date !== "") {
        remindDate = "on " + moment(this.date).format("MM/DD/YYYY");
        dayOfWeek = moment(this.date).format("dddd");
        dayDo = moment(this.date).format("Do");
      } else {
        remindDate = "";
        dayOfWeek = moment().format("dddd");
        dayDo = moment().format("Do");
      }

      var remindTime = "";
      if(this.time) {
        remindTime = this.time;
        var hour = remindTime.split(":")[0];
        var minute = remindTime.split(":")[1];
        Number(hour) < 12 ? remindTime = hour + ":" + minute + "am" : remindTime = String(Number(hour) - 12) + ":" + minute + "pm";
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
