# Babytalk

## Installation ##
```bash
npm install -g tessel
```
or
```bash
cd /where/the/project/is
sudo npm install -g tessel
```

Install module packages
```bash
npm install
```


## Run
* Wifi set up
```bash
tessel wifi -n <wifi ssid> -p <password>
```
* Start application
```bash
cd /where/the/project/is
```
ctrl-c to stop


## Reset Device
* Erase wifi profile
```bash
tessel wifi -d
```

* Erase all files in the device
```bash
tessel erase
```

If the command fails follow the step below
* Push the 'config' button,
* While holding the 'config' button, push 'reset' button.
* Release the 'reset' button, and release the 'config' button

* Run the command again:
```bash
tessel erase
```

* Connect the wifi again
```bash
tessel wifi -n <wifi ssid> -p <password>
```