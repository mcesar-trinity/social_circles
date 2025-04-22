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
-- Table structure for table `tasks`
--

DROP TABLE IF EXISTS `tasks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tasks` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `category_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `tasks_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `task_categories` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tasks`
--

LOCK TABLES `tasks` WRITE;
/*!40000 ALTER TABLE `tasks` DISABLE KEYS */;
INSERT INTO `tasks` VALUES (1,'play basketball',1,'2025-04-08 22:03:08','2025-04-08 22:03:08'),(2,'play soccer',1,'2025-04-08 22:03:08','2025-04-08 22:03:08'),(3,'go swimming',1,'2025-04-08 22:03:08','2025-04-08 22:03:08'),(4,'watch football',2,'2025-04-08 22:05:56','2025-04-08 22:05:56'),(5,'watch basketball',2,'2025-04-08 22:05:56','2025-04-08 22:05:56'),(6,'watch volleyball',2,'2025-04-08 22:05:56','2025-04-08 22:05:56'),(7,'play minecraft',3,'2025-04-08 22:05:56','2025-04-08 22:05:56'),(8,'play GTA',3,'2025-04-08 22:05:56','2025-04-08 22:05:56'),(9,'play fortnite',3,'2025-04-08 22:05:56','2025-04-08 22:05:56'),(10,'listen to rap',4,'2025-04-08 22:05:56','2025-04-08 22:05:56'),(11,'listen to pop',4,'2025-04-08 22:05:56','2025-04-08 22:05:56'),(12,'listen to jazz',4,'2025-04-08 22:05:56','2025-04-08 22:05:56'),(13,'read romance',5,'2025-04-08 22:05:56','2025-04-08 22:05:56'),(14,'read nonfiction',5,'2025-04-08 22:05:56','2025-04-08 22:05:56'),(15,'read comics',5,'2025-04-08 22:05:56','2025-04-08 22:05:56'),(16,'bake cookies',6,'2025-04-08 22:05:56','2025-04-08 22:05:56'),(17,'make pasta',6,'2025-04-08 22:05:56','2025-04-08 22:05:56'),(18,'cook a pizza',6,'2025-04-08 22:05:56','2025-04-08 22:05:56'),(19,'learn how to knit/crochet',7,'2025-04-08 22:05:56','2025-04-08 22:05:56'),(20,'learn how to skateboard',7,'2025-04-08 22:05:56','2025-04-08 22:05:56'),(21,'learn how to speak a new language',7,'2025-04-08 22:05:56','2025-04-08 22:05:56'),(22,'go to the movie theatres',8,'2025-04-08 22:05:56','2025-04-08 22:05:56'),(23,'go to an amusement park',8,'2025-04-08 22:05:56','2025-04-08 22:05:56'),(24,'go to a restaurant',8,'2025-04-08 22:05:56','2025-04-08 22:05:56'),(25,'put up a christmas tree',9,'2025-04-08 22:05:56','2025-04-08 22:05:56'),(26,'host a halloween party',9,'2025-04-08 22:05:56','2025-04-08 22:05:56'),(27,'watch fireworks (4th of july)',9,'2025-04-08 22:05:56','2025-04-08 22:05:56');
/*!40000 ALTER TABLE `tasks` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-04-22 15:59:33
