FROM maven:3.8-openjdk-17 as build

WORKDIR /app

COPY pom.xml .
COPY src ./src

RUN mvn clean package -DskipTests
FROM openjdk:17-jdk-slim

WORKDIR /app
COPY --from=build /app/target/Rentopia-*-SNAPSHOT.jar /app/app.jar

# copy current database file to container (only for debugging)
COPY target/db.mv.db /app/target/db.mv.db

EXPOSE 8080

CMD ["java", "-jar", "/app/app.jar"]
