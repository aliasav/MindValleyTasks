#!/bin/bash

# !! DONOT run as ROOT !!

uwsgi --uid=1000 --gid=1000 /home/aliasav/workspace/MindValleyTasks/mindValleyTasks/uwsgi_server_conf/server.ini

#ini file should be in the same folder from where this script is being run
