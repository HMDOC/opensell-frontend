FROM node:22.9.0
WORKDIR /home/opensell
COPY . .
RUN npm i
RUN npm run build
# We run temporarily in dev to be able to change env variables in the docker compose.
CMD [ "npm", "run", "dev" ]
EXPOSE 3000