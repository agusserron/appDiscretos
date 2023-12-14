-- MySQL dump 10.13  Distrib 8.0.31, for Win64 (x86_64)
--
-- Host: localhost    Database: datosdb
-- ------------------------------------------------------
-- Server version	8.0.31

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `station_aire`
--

DROP TABLE IF EXISTS `station_aire`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `station_aire` (
  `id` int NOT NULL AUTO_INCREMENT,
  `codigo` varchar(45) NOT NULL,
  `identificacion` varchar(45) NOT NULL,
  `estado` tinyint(1) NOT NULL DEFAULT '0',
  `descripcion` varchar(45) DEFAULT NULL,
  `propietario` varchar(45) NOT NULL,
  `operador` varchar(45) NOT NULL,
  `latitud` varchar(45) NOT NULL,
  `longitud` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9134 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `station_aire`
--

LOCK TABLES `station_aire` WRITE;
/*!40000 ALTER TABLE `station_aire` DISABLE KEYS */;
INSERT INTO `station_aire` VALUES (9096,'110','Minas',0,'Batallón','DINACEA','DINACEA','-34.379567','-55.26245'),(9097,'128','Soriano',0,'Dolores PTS','DINACEA','DINACEA','-33.5275','-58.228611'),(9098,'140','Villa Olmos',1,'Escuela N°93 Villa Olmos','DINACEA','DINACEA','-34.699726','-55.9344'),(9099,'109','Río Branco (Estadio)',0,'Estadio','DINACEA','DINACEA','-32.598827','-53.379057'),(9100,'121','Trinidad',0,'Hi Vol PTS','DINACEA','DINACEA','-33.527222','-56.894444'),(9101,'117','Nueva Palmira (MGAP)',0,'MGAP','Intendencia de Colonia','Intendencia de Colonia','-33.876103','-58.417161'),(9102,'118','Melo Móvil',0,'Móvil','DINACEA','DINACEA','-32.370833','-54.159167'),(9103,'120','Juan Lacaze',0,'Móvil PM10','DINACEA','DINACEA','-34.434167','-57.439167'),(9104,'116','Nueva Palmira (Municipio)',1,'Municipio','DINACEA','DINACEA','-33.874583','-58.407211'),(9105,'139','Rivera',1,'Planta Conaprole Rivera','DINACEA','DINACEA','-30.933333','-55.546667'),(9106,'108','Río Branco (Plaza de deportes)',1,'Plaza de deportes','DINACEA','DINACEA','-32.601429','-53.386656'),(9107,'122','Maldonado',0,'PM10','DINACEA','DINACEA','-34.915556','-54.956667'),(9108,'123','Minas de Corrales',0,'PM10','DINACEA','DINACEA','-31.583056','-55.466667'),(9109,'124','Salto',0,'PM10','Intendencia de Salto','Intendencia de Salto','-31.395833','-57.956667'),(9110,'125','San José APL',0,'PM10','DINACEA','DINACEA','-34.329722','-56.712778'),(9111,'129','Tacuarembo',0,'PM10 y PTS','DINACEA','DINACEA','-31.719167','-55.975833'),(9112,'119','Río Branco E001 ',0,'PM10 y PTS','Intendencia de Cerro Largo','Intendencia de Cerro Largo','-32.597743','-53.38457'),(9113,'127','San José Libertad',0,'PTS','DINACEA','DINACEA','-34.629167','-56.61'),(9114,'126','San José DIROX',0,'PTS, Cromo IV y Cromo Total','DINACEA','DINACEA','-34.658056','-56.59'),(9115,'132','Ciudad de la Costa',1,'Shopping Costa Urbana','DINACEA','DINACEA','-34.840675','-55.994081'),(9116,'104','La Paloma',0,'Tanque OSE Costa Azul','DINACEA','DINACEA','-34.632633','-54.165019');
/*!40000 ALTER TABLE `station_aire` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-07-24 12:03:14
