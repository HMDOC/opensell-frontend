FROM node:22.9.0
WORKDIR /home/opensell
COPY . .
RUN npm i
RUN npm run build
CMD [ "npm", "run", "--host", "preview" ]
EXPOSE 3000