**Geotrek mobile**, mobile app of *Geotrek Rando* (http://geotrek.fr).

OVERVIEW
========
This repository contains the whole Geotrek-Mobile project, made with Ionic.


INSTALLATION
============

### Install Node
See https://gist.github.com/isaacs/579814 depending on your environment. 
(Read last comments as some links may change over time)

### Install bower
`npm install -g bower` - package manager to manage project js dependencies

### Install ionic
`npm install -g cordova ionic` - framework used to make Geotrek-Mobile

### Clone the current repository

### Download and install dependencies :
* `npm install`
* `ionic state restore`

### Generate compiled files
`gulp`

### Generate resources
`ionic resources`


CONFIGURATION
=============

Each time you change a script file like the following one, remember to run this command in order to regenerate the compiled files.
`gulp`
It will be regenerated automatically if `ionic serve` is launched.

Configurations of the app are available in the file `www/app/settings/config.js`.

* `DEFAULT_LANGUAGE: 'en'` - defines the fallback language in case the user's favorite is not available. (it needs to be present in the available languages).
* `API_URL: 'http://api-url.com'` - This parameters tells the app where to get the data it will use. 
Note: If you're using Geotrek suite (Geotrek Admin and Geotrek Rando), it's the url of your Geotrek Rando website + `/data`. Geotrek mobile V1.X is compatible with Geotrek Admin 0.XX and Geotrek mobile v2.X is compatible with Geotrek Admin 2.XX
* `CONNECTED_REDIRECTION: 'root.treks_list'` - Redirection after the initialization when a connection is available
* `DISCONNECTED_REDIRECTION: 'root.treks_list'` - Redirection after the initialization when no connection is available


CUSTOMISATION
=============

### Change icon / splash screen
Change the pictures `icon.png`, `splash.png` in resources and then run the command `ionic resources`. Visit : `http://ionicframework.com/docs/cli/icon-splashscreen.html` to find the dimensions.