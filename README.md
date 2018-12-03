# Running

1. You'll need Docker and Docker Compose
2. run ```yarn```
3. run ```gulp scss```
4. run ```gulp build``` (You don't have to leave it running unless you want it to watch for changes.)
5. In a different terminal window run ```docker-compose -f docker-compose-dev.yml up```
6. open browser to http://localhost:8004


Note to self: 
5. In a production environment run
```docker-compose up -d```
