FROM node:alpine
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
COPY .. ./

RUN apk add --no-cache make gcc g++ python3
RUN npm i
CMD ["npm", "run", "start"]