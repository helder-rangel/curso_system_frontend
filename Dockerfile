FROM node:12.16-buster as build-stage
WORKDIR /usr/src/portarias
COPY package*.json ./
RUN yarn install
COPY ./ .
RUN npm run build

FROM nginx:1.17.10 as production-stage
RUN mkdir /usr/src/portarias
COPY --from=build-stage /usr/src/portarias/dist /usr/src/portarias
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]