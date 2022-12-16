FROM node:16

WORKDIR /usr/src/app
COPY . .

RUN npm install -f -g yarn
RUN yarn run build

RUN rm -rf node_modules yarn.lock && yarn install
CMD [ "yarn", "run", "production" ]