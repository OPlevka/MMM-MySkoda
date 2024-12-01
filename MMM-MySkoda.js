
Module.register("MMM-MySkoda", {
  defaults: {
    refresh: 15,
    vehicleOpacity: 0.75,
    showMileage: true,
    showElectricPercentage: true,
    showElectricRange: true,
    showFuelRange: true,
    showLastUpdated: true,
    lastUpdatedText: "Last Updated:"
  },

  getStyles: function () {
    return ["MMM-MySkoda.css"];
  },

  getHeader: function() {
    return "My Skoda";
  },

  getScripts: function () {
    return ["moment.js"];
  },

  start: function () {
    this.sendSocketNotification("MMM-MYSKODA-CONFIG", this.config);
    this.skodaInfo = {};
    this.getInfo();
    this.timer = null;
    this.imageIndex = 0; // Initialize image index for rotation
  },

  // Starts a loop of refreshing data from the Node helper
  getInfo: function () {
    clearTimeout(this.timer);
    this.timer = null;
    this.sendSocketNotification("MMM-MYSKODA-GET", {
	    instanceId: this.identifier,
	    vin: this.config.vin	
    });

    var self = this;
    this.timer = setTimeout(function () {
      self.getInfo();
    }, this.config.refresh * 60 * 1000);
  },

  socketNotificationReceived: function (notification, payload) {
    if (
      notification === "MMM-MYSKODA-RESPONSE" &&
      Object.keys(payload).length > 0
    ) {
      this.skodaInfo = payload;
      this.updateDom(1000);
    }
  },
/*
  faIconFactory: function (icon) {
    var faIcon = document.createElement("i");
    faIcon.classList.add("fas");
    faIcon.classList.add(icon);
    return faIcon;
  },
*/
  getDom: function () {
    var wrapper = document.createElement("div");
    wrapper.classList.add("skoda-wrapper");

    if (this.config.email === "" || this.config.password === "") {
      wrapper.innerHTML = "Missing configuration.";
      return wrapper;
    }

    if (Object.keys(this.skodaInfo).length === 0) {
      wrapper.innerHTML = "Loading...";
      wrapper.className = "dimmed light small";
      return wrapper;
    }

    let info = this.skodaInfo;

    var carContainer = document.createElement("div");
    carContainer.classList.add("skoda-container");

    // Car Name and Model Info
    var carName = document.createElement("div");
    carName.innerHTML = `<strong>Model:</strong> ${info.specification?.title || 'Unknown'}`;
    carContainer.appendChild(carName);

    // License Plate
    var licensePlate = document.createElement("div");
    licensePlate.innerHTML = `<strong>License Plate:</strong> ${info.license_plate || 'N/A'}`;
    carContainer.appendChild(licensePlate);

    // Mileage
    if (this.config.showMileage && info.mileage_in_km) {
      var mileage = document.createElement("div");
      mileage.innerHTML = `<strong>Mileage:</strong> ${info.mileage_in_km} km`;
      carContainer.appendChild(mileage);
    }

    // Fuel Range
    if (this.config.showFuelRange && info.primary_engine_range?.remaining_range_in_km) {
      var fuelRange = document.createElement("div");
      fuelRange.innerHTML = `<strong>Fuel Range:</strong> ${info.primary_engine_range.remaining_range_in_km} km`;
      carContainer.appendChild(fuelRange);
    }

    // Render Main Image (if exists)
    var renders = info.renders || [];
    if (renders.length > 0) {
      var imageContainer = document.createElement("div");
      var imageObject = document.createElement("img");

      // Rotate through images
      var currentRender = renders[this.imageIndex % renders.length]; // Cycle through renders
      imageObject.setAttribute("src", currentRender.url);
      imageObject.setAttribute("style", "opacity: " + this.config.vehicleOpacity + "; max-width: 100%; height: auto;");
      imageContainer.appendChild(imageObject);
      carContainer.appendChild(imageContainer);

      // Increment the image index for the next update
      this.imageIndex++;
    }

    // Fuel Level Status Bar
if (info.primary_engine_range?.current_fuel_level_in_percent !== undefined && info.primary_engine_range?.remaining_range_in_km !== undefined) {
  var fuelBarContainer = document.createElement("div");
  fuelBarContainer.style.position = "relative";
  fuelBarContainer.style.height = "20px";
  fuelBarContainer.style.width = "100%";
  fuelBarContainer.style.backgroundColor = "#ccc";
  fuelBarContainer.style.borderRadius = "5px";
  fuelBarContainer.style.marginBottom = "5px";
  fuelBarContainer.style.overflow = "hidden";

  var fuelBar = document.createElement("div");
  fuelBar.style.height = "100%";
  fuelBar.style.width = info.primary_engine_range.current_fuel_level_in_percent + "%";
  // Change color based on fuel level
  if (info.primary_engine_range.current_fuel_level_in_percent < 15) {
    fuelBar.style.backgroundColor = "#ff0000"; // Red color for low fuel
  } else {
    fuelBar.style.backgroundColor = "#4caf50"; // Green color for normal fuel
  }
  fuelBar.style.textAlign = "center";
  fuelBar.style.lineHeight = "20px";
  fuelBar.style.color = "white";
  fuelBar.style.fontSize = "12px";
  fuelBar.innerText = `${info.primary_engine_range.current_fuel_level_in_percent}% (${info.primary_engine_range.remaining_range_in_km} km)`;

  fuelBarContainer.appendChild(fuelBar);
  carContainer.appendChild(fuelBarContainer);
}

    // Last Updated
    if (this.config.showLastUpdated && info.car_captured_timestamp) {
      var lastUpdated = document.createElement("div");
      lastUpdated.innerHTML = `<em>${this.config.lastUpdatedText} ${moment(info.car_captured_timestamp).fromNow()}</em>`;
      carContainer.appendChild(lastUpdated);
    }

    wrapper.appendChild(carContainer);
    return wrapper;
  }
});
