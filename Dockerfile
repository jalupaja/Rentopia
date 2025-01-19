FROM debian:bullseye-slim AS build

WORKDIR /app

RUN apt-get update && apt-get install -y openjdk-17-jre openjdk-17-jdk build-essential nodejs npm maven

COPY pom.xml .
COPY src ./src

RUN mvn clean package -DskipTests

COPY Frontend/package*.json ./Frontend/

RUN cd Frontend && npm install && cd ..

COPY Frontend/ ./Frontend
RUN cd Frontend && npm run build && cd ..

RUN  cp /app/target/Rentopia-*-SNAPSHOT.jar /app/app.jar

# copy current database file to container (only for debugging)
COPY target/db.mv.db /app/target/db.mv.db

COPY start.sh /start.sh
RUN chmod +x /start.sh

EXPOSE 8080
EXPOSE 3000

CMD ["/bin/sh", "-c", "java -jar /app/app.jar &  cd /app/Frontend && npm start"]

