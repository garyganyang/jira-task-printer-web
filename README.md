# jira-task-printer-web

Nginx
        location /jira-printer {
            alias /usr/local/openresty/nginx/html/jira-printer;
            try_files $uri $uri/ /jira-printer/index.html;
            index  index.html;
        }

        location /jira-api/ {
          add_header Access-Control-Allow-Origin  *;
          add_header Access-Control-Allow-Credentials 'true';
          add_header Access-Control-Allow-Methods 'GET, POST, OPTIONS';
          add_header Access-Control-Allow-Headers 'DNT,X-Mx-ReqToken,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Authorization,x-xsrf-token,Set-Cookie';
          if ($request_method = 'OPTIONS') {
              return 204;
          }
           proxy_set_header    Host $host;
           proxy_set_header    X-Real-IP $remote_addr;
           proxy_set_header    X-Forwarded-For   $proxy_add_x_forwarded_for;
           proxy_pass http://192.168.0.45:9090/;
        }
