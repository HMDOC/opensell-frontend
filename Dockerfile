FROM node

WORKDIR /home/opensell
COPY ./build ./build

RUN npm install -g serve

CMD ["serve", "-s", "build"]
EXPOSE 3000