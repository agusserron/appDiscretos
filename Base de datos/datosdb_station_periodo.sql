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
-- Table structure for table `station_periodo`
--

DROP TABLE IF EXISTS `station_periodo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `station_periodo` (
  `id` int NOT NULL AUTO_INCREMENT,
  `idStation` int NOT NULL,
  `tipo` varchar(45) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idStation_idx` (`idStation`),
  CONSTRAINT `idStation` FOREIGN KEY (`idStation`) REFERENCES `station_aire` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=76 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `station_periodo`
--

LOCK TABLES `station_periodo` WRITE;
/*!40000 ALTER TABLE `station_periodo` DISABLE KEYS */;
INSERT INTO `station_periodo` VALUES (1,9096,'24 Horas'),(2,9097,'24 Horas'),(3,9098,'24 Horas'),(4,9099,'24 Horas'),(5,9100,'24 Horas'),(6,9101,'24 Horas'),(7,9102,'24 Horas'),(8,9103,'24 Horas'),(9,9104,'24 Horas'),(10,9105,'24 Horas'),(11,9106,'24 Horas'),(12,9107,'24 Horas'),(13,9108,'24 Horas'),(14,9109,'24 Horas'),(15,9110,'24 Horas'),(16,9111,'24 Horas'),(17,9112,'24 Horas'),(18,9111,'Anual'),(19,9113,'24 Horas'),(20,9114,'24 Horas'),(21,9115,'24 Horas'),(22,9116,'24 Horas'),(23,9116,'Anual');
/*!40000 ALTER TABLE `station_periodo` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-07-24 12:03:15
