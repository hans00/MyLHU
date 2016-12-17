FROM node:alpine

MAINTAINER "Hans Zhang <d1044182013@gm.lhu.edu.tw>"

ENV APP_HOME /app
RUN mkdir $APP_HOME
WORKDIR $APP_HOME

# Install app dependencies
COPY package.json $APP_HOME/
RUN npm install

# Copy our code from the current folder to /app inside the container
COPY . $APP_HOME
RUN npm run build

# Make port 3000 available for publish
EXPOSE 3000

# Start server
CMD [ "npm", "start" ]
