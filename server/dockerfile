FROM node:23-alpine3.20
RUN npm install -g pnpm
WORKDIR /server
COPY pnpm-lock.yaml package.json ./
COPY . .
RUN pnpm install
EXPOSE 8080
CMD ["pnpm", "start"]
ENV DEV_STATUS = development DB_URI=mongodb+srv://pauloCastillo:pogh3gb3WGbLgsoI@prj-t2.70zydwj.mongodb.net/?retryWrites=true&w=majority&appName=prj-T2 SECRET_KEY=3fac2817624fd140bc7e13e0c5fc929bc5044b9306413945b1ef911e3b7abf60 API_KEY=pBAdPpS5UZwacgbZEMh8NoaqdjFFhNADm5Y1bD7AcyQ APP_ID=uTrELyHElOWcRllqest2 PORT_DEV=9000 PORT_PROD=8080 CLIENT_URL = * MOBILE_APP_URL = http://192.168.1.14:8080 SSL_KEY: ./etc/cert/key.pem SSL_CERT: ./etc/cert/cert.pem
