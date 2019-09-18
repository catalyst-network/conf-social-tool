# develop stage
FROM node:11.1-alpine as dev
WORKDIR /app
COPY package*.json ./
RUN yarn global add @quasar/cli
COPY . .

# build stage
FROM dev as build
RUN yarn
RUN quasar build

# production stage
FROM nginx:1.15.7-alpine as prod
COPY --from=build /app/dist/spa /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]