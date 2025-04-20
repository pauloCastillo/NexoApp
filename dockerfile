FROM node:22.14.0-alpine3.17
DIR /server
COPY package.json ./
RUN npm install
COPY . .
EXPOSE 8000
CMD ["npm", "start"]
# docker build -t my-node-app .
# docker run -p 8000:8000 my-node-app
# docker run -p 8000:8000 -v $(pwd):/usr/src/app my-node-app
# docker run -p 8000:8000 -v $(pwd):/usr/src/app --name my-node-app my-node-app
# docker run -p 8000:8000 -v $(pwd):/usr/src/app --name my-node-app -d my-node-app
