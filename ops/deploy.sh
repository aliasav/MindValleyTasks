# run this script as app user and virtualenv activated

# fetch code
cd ../mindValleyTasks/
git checkout -- static/angular_apps/dashboard/app.js
git pull origin develop

# make app.js changes
source ops/angularjs_settings.sh

# perform collectstatic
python manage.py collectstatic --noinput

# migrate
python manage.py migrate

# server restart
source uwsgi_server_conf/server_stop.sh
sleep 2
source uwsgi_server_conf/server_start.sh
