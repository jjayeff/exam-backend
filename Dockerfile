FROM node:10-alpine

RUN npm install pm2 -g

WORKDIR /usr/src/app

ADD . /usr/src/app

RUN npm install --production

EXPOSE 4000

CMD ["npm", "start"]
