# API

-   [NestJS](https://docs.nestjs.com/)
-   [Typescript](https://www.typescriptlang.org/docs/handbook/)
-   [Prisma](https://www.prisma.io/docs/)

## Installation

```
$ npm install
```

## Running the app

-   Copy `.env.example` to `.env`
-   Here is the sample `.env` file:

```
PORT=3001
DEBUG=true
LOG_LEVEL=10

DATABASE_URL="postgresql://postgres:click123@localhost:5432/api_db?schema=public"

REDIS_HOST=localhost
REDIS_PORT=6379

TOKEN_EXPIRATION=604800 # 7 days

AWS_ACCESS_KEY=
AWS_SECRET_KEY=
AWS_REGION=us-east-1
AWS_BUCKET=api-dev
AWS_BUCKET_BASE_URL=https://api-dev.s3.amazonaws.com/
AWS_STS_ROLE_ARN=
AWS_QUEUE_URL=https://sqs.us-east-1.amazonaws.com/267977419284/api-dev-queue
AWS_SES_FROM_EMAIL=no-reply@dev-api.api.kodefuse.com

GOOGLE_OAUTH_ENDPOINT=https://oauth2.googleapis.com/tokeninfo
APPLE_OAUTH_ENDPOINT=https://appleid.apple.com

NEST_DEBUG=true
```

-   Start PostgreSQL and Redis docker container

```
docker volume create --name=api_postgres_data
docker volume create --name=api_redis_data
docker-compose up -d
```

-   Run the migrations

```
npm run db:migrate
```

-   Generate typings for the schema.prisma file

```
npm run db:generate
```

## Start the application

```
npm run start:dev
```

## Swager

Visit the following link after starting your application to see the Swagger documentation:

[Swagger](http://localhost:3001/v1/api)

## Deploying code on an AWS EC2 instance

Please create an EC2 instance with the following AMI that has all the pre-requisites installed

[node-docker-nginx-ami](https://us-east-1.console.aws.amazon.com/ec2/home?region=us-east-1#ImageDetails:imageId=ami-0e3e8d17e834d404c)
