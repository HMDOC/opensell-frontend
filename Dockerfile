FROM node

WORKDIR /home/opensell
COPY . .
RUN npm i
# Running temporarily in dev, because we cannot change env variables after the build.
CMD ["npm", "start"]
EXPOSE 3000
