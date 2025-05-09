-- MySQL dump 10.13  Distrib 8.0.41, for macos15 (x86_64)
--
-- Host: 127.0.0.1    Database: social_game
-- ------------------------------------------------------
-- Server version	9.2.0

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
-- Table structure for table `user_character_score`
--

DROP TABLE IF EXISTS `user_character_score`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_character_score` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `character_id` int DEFAULT NULL,
  `happiness_score` int DEFAULT NULL,
  `durability_score` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `character_id` (`character_id`),
  CONSTRAINT `user_character_score_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `user_character_score_ibfk_2` FOREIGN KEY (`character_id`) REFERENCES `game_characters` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=88 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_character_score`
--

LOCK TABLES `user_character_score` WRITE;
/*!40000 ALTER TABLE `user_character_score` DISABLE KEYS */;
INSERT INTO `user_character_score` VALUES (1,1,1,0,5),(2,1,2,0,6),(3,1,3,0,4),(4,4,1,0,5),(5,4,2,0,6),(6,4,3,0,4),(7,5,1,10,5),(8,5,2,32,4),(9,5,3,3,4),(10,6,1,0,5),(11,6,2,0,6),(12,6,3,0,4),(13,7,1,0,5),(14,7,2,0,6),(15,7,3,0,4),(16,8,1,0,5),(17,8,2,0,6),(18,8,3,0,4),(19,11,1,0,NULL),(20,11,2,0,NULL),(21,11,3,0,NULL),(22,11,11,0,3),(23,9,11,0,3),(24,7,11,0,3),(25,1,11,0,3),(26,4,11,0,3),(27,6,11,0,3),(28,8,11,0,3),(29,5,11,0,0),(30,11,12,0,7),(31,9,12,0,7),(32,7,12,0,7),(33,1,12,0,7),(34,4,12,0,7),(35,6,12,0,7),(36,8,12,0,7),(37,5,12,2,6),(38,11,13,0,5),(39,9,13,0,5),(40,7,13,0,5),(41,1,13,0,5),(42,4,13,0,5),(43,6,13,0,5),(44,8,13,0,5),(45,5,13,4,5),(46,11,14,0,4),(47,9,14,0,4),(48,7,14,0,4),(49,1,14,0,4),(50,4,14,0,4),(51,6,14,0,4),(52,8,14,0,4),(53,5,14,2,3),(54,11,15,0,3),(55,9,15,0,3),(56,7,15,0,3),(57,1,15,0,3),(58,4,15,0,3),(59,6,15,0,3),(60,8,15,0,3),(61,5,15,2,1),(62,11,16,0,6),(63,9,16,0,6),(64,7,16,0,6),(65,1,16,0,6),(66,4,16,0,6),(67,6,16,0,6),(68,8,16,0,6),(69,5,16,0,5),(70,12,1,2,3),(71,12,2,0,3),(72,12,3,0,4),(73,12,11,1,2),(74,12,12,2,5),(75,12,13,1,4),(76,12,14,0,0),(77,12,15,8,3),(78,12,16,2,6),(79,13,1,2,1),(80,13,2,2,6),(81,13,3,4,4),(82,13,11,1,0),(83,13,12,1,5),(84,13,13,2,4),(85,13,14,1,1),(86,13,15,2,3),(87,13,16,0,5);
/*!40000 ALTER TABLE `user_character_score` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-04-30  9:54:29
