FROM node
WORKDIR /app
RUN npm install
WORKDIR /app
CMD ["npm", "start"]