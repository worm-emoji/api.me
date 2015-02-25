#!/bin/sh
# This script launches the site on boot

# Change to node directory
cd /home/luke/api.lukemil.es/
# Start nodemon on 3000 (iptables corrects route to port 80)
NODE_ENV=production PORT=3000 forever bin/www -c