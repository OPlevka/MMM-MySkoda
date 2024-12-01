var NodeHelper = require("node_helper");
const spawn = require("child_process").spawn;

module.exports = NodeHelper.create({

  start: function () {
    console.log("Starting node_helper for module: " + this.name);
    this.skodaInfo = {};
    this.config = {};
  },

  socketNotificationReceived: function (notification, payload) {
    console.log("socketNotificationReceived helper");
    var self = this;
    var vin = payload.vin;
      
    if (notification == "MMM-MYSKODA-CONFIG") {
      console.log("socketNotificationReceived helper MMM-MYSKODA-CONFIG vin:" + vin);
      self.config[vin] = payload;
      self.skodaInfo[vin] = null;
    } else if (notification == "MMM-MYSKODA-GET") {
      console.log("socketNotificationReceived helper MMM-MYSKODA-GET");
      const config = self.config[vin];  

      console.log("socketNotificationReceived helper MMM-MYSKODA-GET starting python");
      const pythonProcess = spawn('python3',["modules/MMM-MySkoda/getMySkodaData.py", config.email, config.password, config.vin]);
      console.log("socketNotificationReceived helper MMM-MYSKODA-GET after python");

      pythonProcess.stdout.on('data', (data) => {
        console.log("MySkoda Received JSON from Python:" + data);
        self.skodaInfo[vin] = JSON.parse(data);

        console.log("sendResponse helper MMM-MYSKODA-RESPONSE")
        self.sendSocketNotification("MMM-MYSKODA-RESPONSE", self.skodaInfo[vin]);
      });

      pythonProcess.stderr.on('data', (data) => {
        console.error(`MySkoda python error: ${data}`);
      });

    }
  },
});
