# MMM-MySkoda
Magic Mirror Module to display data from MySkoda for your car(s).

![Screenshot](img/screenshot.png "Screenshot")

The module displays model name, license plate, mileage, fuel range and render car images. It also shows the time the MySkoda API last received data from the car.

If you own several Skoda cars, you can configure a module for each of them. The module configuration requires the vin number of the car to separate multiple module instances.

The module is based on MySkoda Python library [myskoda](https://github.com/skodaconnect/myskoda) which is used to query the MySkoda API.

## Requirements

**A working python 3 distribution with pip is required before the installation.**
More specifically, Python <4.0, >=3.12.0.

## Installation

Clone this repository in your modules folder, and install dependencies:

    cd ~/MagicMirror/modules
    git clone https://github.com/OPlevka/MMM-MySkoda
    cd MMM-MySkoda
    npm install 


## Configuration

Go to the MagicMirror/config directory and edit the config.js file. Add the module to your modules array in your config.js.

You'll need your MySkoda email and password, and your car's VIN number.

Enter these details in the config.js for your MagicMirror installation:

        {
            module: "MMM-MySkoda",
            position: "top_right",
            config: {
                email: "email@example.com",
                password: "myComplexPassword",
                vin: "XXXXXXXXXXXXXXXXX"
            }
        },

## Changelog

**2024-12-01** First version

## Thank you
Thanks [MM-MyBMW](https://github.com/Jargendas/MMM-MyBMW) for inspiration