#!/bin/bash
export RACK_ENV=production
export BROWSER=/usr/local/firefox/firefox
export DB_PASSWORD=xxxxxx

cd `dirname $0`
source ../password.sh
./vendor/2.1.8/bin/ruby ru.rb
