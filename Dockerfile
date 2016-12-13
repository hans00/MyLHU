FROM node:7

MAINTAINER "Hans Zhang <d1044182013@gm.lhu.edu.tw>"

WORKDIR /app

ADD src /app

RUN npm install && \
    npm run build

EXPOSE 8080
CMD ["npm", "start"]
