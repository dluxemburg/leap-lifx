#leap-lifx

A little application for controlling [LIFX bulbs](http://lifx.co/) with a [Leap Motion](https://www.leapmotion.com/) controller.

## Setup (Ubuntu w/ systemd)
1. Symlink script, e.g.: `sudo ln -s index.js /opt/leap-lifx.js`
2. Add service file, e.g:
```
sudo cp leap-lifx.service /lib/systemd/system/
sudo chmod 644 /lib/systemd/system/leap-lifx.service
sudo ln -s /lib/systemd/system/leap-lifx.service /etc/systemd/system/leap-lifx.service
```
