FROM node:22-bookworm
WORKDIR /home/opensell
COPY . .
RUN npm i
RUN npm run build
RUN npm install -g npm@10.9.0
# We run temporarily in dev to be able to change env variables in the docker compose.
CMD [ "npm", "run", "dev" ]
EXPOSE 3000
