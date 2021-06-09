FROM maven:3-adoptopenjdk-11-openj9 as builder
#FROM maven:3-openjdk-11-slim as builder
WORKDIR /code
COPY .. /code/
RUN mvn install -DskipTests=true

FROM adoptopenjdk/openjdk11-openj9:jdk-11.0.1.13-alpine-slim
EXPOSE 8080
EXPOSE 5005
EXPOSE 5701
EXPOSE 8124
EXPOSE 8224
WORKDIR /app
RUN pwd
COPY --from=builder /code/target/*.jar application.jar

CMD ["sh", "-c","java -Djava.security.egd=file:/dev/./urandom -jar /app/application.jar"]