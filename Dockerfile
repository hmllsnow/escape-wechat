# 第一阶段：构建React应用
FROM node:20-alpine AS build

WORKDIR /app

COPY frontground/package*.json ./
RUN npm ci --only=production

COPY frontground/ .
RUN npm run build

# 第二阶段：最终镜像
FROM node:20-alpine

# 设置时区
#RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
#RUN echo 'Asia/Shanghai' >/etc/timezone

# 安装 tzdata 包
RUN apk update && apk add --no-cache tzdata

# 设置时区为上海(alpine与其他linux发行版不同)
RUN cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
RUN echo "Asia/Shanghai" > /etc/timezone

# 创建应用程序目录
WORKDIR /usr/src/app

# 安装background依赖
COPY background/package*.json ./background/
RUN cd background && npm ci --only=production && npm install pm2 -g

# 安装bot依赖
COPY bot/package*.json ./bot/
RUN cd bot && npm ci --only=production

# 复制background和bot的源代码
COPY background/ ./background/
COPY bot/ ./bot/

# 构建React应用
COPY --from=build /app/build /usr/src/app/frontground/build

# 安装Nginx
#RUN apt-get update && apt-get install -y nginx && rm -rf /var/lib/apt/lists/*
RUN apk update && apk add --no-cache nginx

# 将React应用的构建结果复制到Nginx的默认目录
#RUN cp -r frontground/build/* /var/www/html/
RUN mkdir -p /var/www/html/ && cp -r frontground/build/* /var/www/html/

# 复制Nginx配置文件（）
#COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/http.d/default.conf

# 安装jq
#RUN apt-get update && apt-get install -y jq
RUN apk add --no-cache jq

# 暴露端口
EXPOSE 443 8080

# 启动脚本
CMD ["sh", "-c", "jq --arg baseurl \"${OPENAI_BASE_URL:-$(jq -r '.baseurl' /usr/src/app/bot/openai.json)}\" \
                     --arg apikey \"${OPENAI_API_KEY:-$(jq -r '.apikey' /usr/src/app/bot/openai.json)}\" \
                     --arg model \"${OPENAI_MODEL:-$(jq -r '.model' /usr/src/app/bot/openai.json)}\" \
                     '. | .baseurl=$baseurl | .apikey=$apikey | .model=$model' \
                     /usr/src/app/bot/openai.json > /usr/src/app/bot/openai.json.tmp \
                && mv /usr/src/app/bot/openai.json.tmp /usr/src/app/bot/openai.json \
                && jq --arg apikey \"${API_KEY:-$(jq -r '.apikey' /usr/src/app/background/apiconfig.json)}\" \
                     '. | .apikey=$apikey' \
                     /usr/src/app/background/apiconfig.json > /usr/src/app/background/apiconfig.json.tmp \
                && mv /usr/src/app/background/apiconfig.json.tmp /usr/src/app/background/apiconfig.json \
                && cd background \
                && pm2 start index.js \
                & nginx -g 'daemon off;'"]