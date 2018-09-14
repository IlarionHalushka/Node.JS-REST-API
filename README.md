**To run server:**
```
$mongod
$npm run dev
```

**Swagger documentation:**

`http://localhost:3000/api-docs/`

**To run auto tests:**
```
$mongod
$npm run api-test
```


**To run prettier and eslint on staged files:**
```
$git add .
$npm run precommit
```
**OR 'precommit' will automatically run before commits:**
```
$git add .
$git commit -m 'commit message'
```

**To debug the application in chrome dev tools:**
```
$mongod
$npm run debug
```


**To debug auto tests in chrome dev tools:**
```
$mongod
$npm run api-test-debug
```


**To view a test coverage:**
```
$mongod
$npm run api-test-coverage
```
Open in browser `./coverage/lcov-report/index.html`  to see the test coverage of files and functions. 