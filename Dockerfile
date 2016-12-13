FROM node:alpine

RUN mkdir /app
ADD . /app
WORKDIR /app
RUN npm install && \
    npm run build && \
    rm -Rf src

EXPOSE 8080

ENTRYPOINT ["npm", "start"]
