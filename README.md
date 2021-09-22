# jira-task-printer-web
![](http://mrdoc.zmister.com/media/202109/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20210922162155_1632299000.png)
![](http://mrdoc.zmister.com/media/202109/20210922163648_1632299872.png)
![](http://mrdoc.zmister.com/media/202109/20210922163320_1632299704.png)
![](http://mrdoc.zmister.com/media/202109/20210922163248_1632299712.jpg)

### Nginx Conf
```cf
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
```
