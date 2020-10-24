FROM node:12

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN REACT_APP_BACKEND=http://develop.nl-mail.ru npm run build && ls && ls build/

EXPOSE 3001

CMD ["/bin/sh", "-c", "npm run start"]