# syntax=docker/dockerfile:1

FROM node
WORKDIR /opensell/
COPY ./public /opensell/public
COPY ./src /opensell/src
COPY ./package.json /opensell/package.json
COPY ./tsconfig.json /opensell/tsconfig.json
RUN npm install
CMD ["npm", "start"]
EXPOSE 3000
