# shell script to make changes in app.js file 

# changing web app.js settings

# Remove development server urls 
 
sed -i '/server: "http:\/\/127.0.0.1:8000\/",/c\      server2: "http:\/\/127.0.0.1:8000\/",' /home/aliasav/workspace/MindValleyTasks/mindValleyTasks/static/angular_apps/dashboard/app.js
sed -i '/server1: "http:\/\/139.59.21.6\/",/c\		server: "http:\/\/139.59.21.6\/",' /home/aliasav/workspace/MindValleyTasks/mindValleyTasks/static/angular_apps/dashboard/app.js
