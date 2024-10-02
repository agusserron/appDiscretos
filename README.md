# SDA-RD
Sistema de Datos Ambientales- Recepción Discreta

## Test : 172.28.110.33/angular_testing/SRD
## Produccion http://172.28.0.60/angular-testing/login

Pasos para levantar el ambiente de test: 

## npm install : para levantar todas las dependencias ##

Base : en archivo .env // SRD\Backend\shared\connectionMariaDB

# DATOS_DISCRETOS DB credentials
DB_HOST = 172.20.110.29
DB_PORT = 3306
DB_DATABASE = discretos_test
DB_USER = user
DB_PASSWORD = pass

-Revisar conexiones del frontend con el backend (Frontend\angular\src\environments) - sustituir : const baseIP = "http://localhost:3005";
-Agrega credenciales de BASE DATOS : Backend\aire_service\env;


1. Levantar el FRONTEND (Angular): 
   -Abrir una terminal 
   -cd .\Frontend\  
   -cd .\angular\
   -ng serve --open

2. Levantar la arquitectura de microservicios en el siguiente orden (cada microservicio tiene que ser levantado en una terminal diferente) : 
    
   2.1 Servicio api_gateway (puerta de entrada a todo)
   -Abrir una terminal
   -cd .\Backend\
   -cd .\api_gateway\ 
   -node server.js 


   2.2 Servicio auth_service (Este se conecta con la app de loginMA, pide un token con el nombre de usuario y pass que se le pasa)
   -cd .\Backend\
   -cd .\auth_service\
   -node app.js 
    
   2.3 Servicio aire_service
   -cd .\Backend\
   -cd .\aire_service\
   -node index.js 

3. Usuario de test : 
   -admin
   -Nuevoamb13nt3.2024







