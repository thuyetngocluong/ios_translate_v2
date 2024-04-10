FROM node:20

LABEL maintainer="thuyetln"

EXPOSE 4000

WORKDIR /app

COPY . .

RUN npm install --pure-lockfile

RUN npm run build

RUN npm install -g serve

CMD ["serve", "-s", "build", "-l", "4000"]
