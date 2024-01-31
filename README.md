# SDA-RD
Sistema de Datos Ambientales- Recepción Discreta

Pasos para levantar el ambiente de test: 

## npm install : para levantar todas las dependencias ##

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
   -Nuevoamb13nt3.2023




