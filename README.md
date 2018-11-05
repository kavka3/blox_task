# Blox Task

University courses registration management service, using

+ express
+ mongoose
+ babel-cli
+ winston and morgan for logging
+ Async/Await

## Installation

Clone the repository and run `npm install`

```
git clone https://github.com/kavka3/blox_task.git
npm install
```

## Starting the server

```
npm start
```

The server will run on port 3000.

## API

Use postman collection

```
blox.postman_collection.json
```

+ mokedata
```
POST http://localhost:3000/students/mokedata
```

+ Create student
```
POST http://localhost:3000/students
```
--name required

+ Get all students
```
GET http://localhost:3000/students
```

+ Get student by Id
```
GET http://localhost:3000/students/{id}
```

+ Update student by Id
```
PUT http://localhost:3000/students/{id}
```

+ Delete student by Id
```
DELETE http://localhost:3000/students/{id}
```