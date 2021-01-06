FROM node
COPY ./package.json /app/package.json
COPY ./index.js /app/index.js
WORKDIR /app
RUN npm install
CMD ["npm", "start"]
