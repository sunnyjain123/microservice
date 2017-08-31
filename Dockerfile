# Install argon(V4) of node js
FROM node:argon

# Install MongoDB
RUN apt-get install -y mongodb-org

# Run MongoDB Service
RUN service mongod start

# Install mocha to run test cases
Run npm install --global mocha

# Create microservice Folder
RUN mkdir /microservice

# Make microservice your working directory
WORKDIR /microservice

# Copy package.json file from microservice directory
COPY package.json /microservice

# Run npm install to install all dependencies
RUN npm install

# Copy complete image of microservice
COPY . /microservice

# open your port on which server will run
EXPOSE 3000

# Run server with command npm start
CMD ["npm", "start"]