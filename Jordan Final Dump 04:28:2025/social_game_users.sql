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
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `role` enum('user','admin') DEFAULT 'user',
  `bio` varchar(255) DEFAULT NULL,
  `happiness_score` int DEFAULT NULL,
  `max_happiness_score` int DEFAULT NULL,
  `profile_color` varchar(7) DEFAULT '#808080',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'malea_bea','mlc.enge@gmail.com','$2b$10$2J7ysDWC1Ctf79X1fGSM2uhfJd3BzQYODcP0CO9gkOwwttpe3O6RC','2025-04-06 21:42:47','2025-04-22 14:02:45','admin',NULL,18,0,'#808080'),(4,'malea!','malea.cesar26@gmail.com','$2b$10$9dJLCVxwtxwzcDotj5.MqeIEzkbvzzFCo.Oq2vMq1.iAwRnXn9aTq','2025-04-06 22:50:31','2025-04-22 14:02:45','user',NULL,18,0,'#808080'),(5,'shadow','pikmin@gmail.com','$2b$10$J1pLcz7yocjUvnAgJSmJFOJDWTbbp1RTe22NfiZIizb3lbmdxGFoO','2025-04-07 18:42:04','2025-04-28 16:19:42','admin',NULL,5,27,'#00ff73'),(6,'mel','pop@gmail.com','$2b$10$hE41cOv2SxsJr/NsJX9XSeq2okrzC5gpwTDKq6uI/hL6gXn7hbopK','2025-04-08 23:14:51','2025-04-22 14:02:45','user',NULL,18,0,'#808080'),(7,'farquad','quad22@gmail.com','$2b$10$2s1mGYj9UPgCaGJk3ENpBOcCTOn2oYaN3rvOiMXEBfFlrpeO3xi7a','2025-04-08 23:18:33','2025-04-22 14:02:45','user',NULL,18,0,'#808080'),(8,'Meow3','pickme@gmail.com','$2b$10$tzu77p.4w4h.h91wzowFF.RPZOG4cF73f0mwD4VdPe7O3SQ82xrWu','2025-04-08 23:23:49','2025-04-22 14:02:45','user',NULL,18,0,'#808080'),(9,'dummyAccount','dummy10@gmail.com','$2b$10$N2kqq1h.wq3xJd9eiV9TpuqDyx1kdZr.gAQHF9mh6Hq0bHmMsgyoK','2025-04-11 14:11:40','2025-04-22 14:02:45','user',NULL,18,0,'#808080'),(11,'bea','bea@gmail.com','$2b$10$1lE9dPnH3ldE8CWKb.DJzegVToYL2nEEUt82NHEHiZRcN.Cgwjlj.','2025-04-22 21:15:08','2025-04-28 01:20:23','admin',NULL,NULL,NULL,'#bbff00');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-04-28 11:25:26
