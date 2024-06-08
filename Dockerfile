# 第一阶段：构建React应用
FROM node:20-slim AS build

WORKDIR /app

COPY frontground/package*.json ./
RUN npm install

COPY frontground/ .
RUN npm run build

# 第二阶段：最终镜像
FROM node:20-slim

# 设置阿里云镜像源
# RUN echo "deb http://mirrors.aliyun.com/debian/ buster main non-free contrib" > /etc/apt/sources.list \
#     && echo "deb-src http://mirrors.aliyun.com/debian/ buster main non-free contrib" >> /etc/apt/sources.list \
#     && echo "deb http://mirrors.aliyun.com/debian-security buster/updates main" >> /etc/apt/sources.list \
#     && echo "deb-src http://mirrors.aliyun.com/debian-security buster/updates main" >> /etc/apt/sources.list \
#     && echo "deb http://mirrors.aliyun.com/debian/ buster-updates main non-free contrib" >> /etc/apt/sources.list \
#     && echo "deb-src http://mirrors.aliyun.com/debian/ buster-updates main non-free contrib" >> /etc/apt/sources.list \
#     && echo "deb http://mirrors.aliyun.com/debian/ buster-backports main non-free contrib" >> /etc/apt/sources.list \
#     && echo "deb-src http://mirrors.aliyun.com/debian/ buster-backports main non-free contrib" >> /etc/apt/sources.list

# # 安装Chrome和其他依赖项
# RUN sed -i 's/deb.debian.org/mirrors.aliyun.com/g' /etc/apt/sources.list \
#     && apt-get update && apt-get install -y \
#     wget \
#     gnupg \
#     ca-certificates \
#     apt-transport-https \
#     libgbm-dev \
#     libnss3 \
#     && rm -rf /var/lib/apt/lists/*

# # 安装Chrome
# RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
#     && echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list \
#     && apt-get update \
#     && apt-get install -y google-chrome-stable \
#     && rm -rf /var/lib/apt/lists/*

# 创建应用程序目录
WORKDIR /usr/src/app

# 安装background依赖
COPY background/package*.json ./background/
RUN cd background && npm install && npm install pm2 -g

# 安装bot依赖
COPY bot/package*.json ./bot/
RUN cd bot && npm install

# 安装frontground依赖
COPY frontground/package*.json ./frontground/
RUN cd frontground && npm install

# 复制background和bot的源代码
COPY background/ ./background/
COPY bot/ ./bot/

# 构建React应用
COPY --from=build /app/build /usr/src/app/frontground/build


# 安装Nginx
RUN apt-get update && apt-get install -y nginx && rm -rf /var/lib/apt/lists/*

# 将React应用的构建结果复制到Nginx的默认目录
RUN cp -r frontground/build/* /var/www/html/

# 复制Nginx配置文件
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 安装jq
RUN apt-get update && apt-get install -y jq

# 暴露端口
EXPOSE 3000 443 8080

# 启动脚本
#CMD ["sh", "-c", "cd background && node index.js & nginx -g 'daemon off;'"]
CMD ["sh", "-c", "jq --arg baseurl \"${OPENAI_BASE_URL:-$(jq -r '.baseurl' /usr/src/app/bot/openai.json)}\" --arg apikey \"${OPENAI_API_KEY:-$(jq -r '.apikey' /usr/src/app/bot/openai.json)}\" --arg model \"${OPENAI_MODEL:-$(jq -r '.model' /usr/src/app/bot/openai.json)}\" '. | .baseurl=$baseurl | .apikey=$apikey | .model=$model' /usr/src/app/bot/openai.json > /usr/src/app/bot/openai.json.tmp && mv /usr/src/app/bot/openai.json.tmp /usr/src/app/bot/openai.json && cd background && pm2 start index.js & nginx -g 'daemon off;'"]