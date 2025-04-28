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
-- Table structure for table `game_characters`
--

DROP TABLE IF EXISTS `game_characters`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `game_characters` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `loves` varchar(255) NOT NULL,
  `likes` varchar(255) NOT NULL,
  `dislikes` varchar(255) NOT NULL,
  `hates` varchar(255) NOT NULL,
  `activity_durability` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `npc_picture` varchar(255) DEFAULT NULL,
  `color` varchar(20) DEFAULT NULL,
  `description` varchar(5000) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `game_characters`
--

LOCK TABLES `game_characters` WRITE;
/*!40000 ALTER TABLE `game_characters` DISABLE KEYS */;
INSERT INTO `game_characters` VALUES (1,'Krypton','playing video games','playing sports','cooking/baking','reading',5,'2025-04-08 22:39:23','2025-04-11 03:09:03','Krypton.png','#6BE5D3','Krypton is an energetic and competitive soul who’s always on the move. They shine in activities that demand quick reflexes and focus. While they’re not one to linger in quiet spaces, their bold personality and sharp edge make them stand out in any crowd.'),(2,'Thalion','reading','celebrating holidays','watching sports','learning something new',6,'2025-04-08 22:39:23','2025-04-11 03:20:05','Thalion.png','#CAD838','Thalion is a thoughtful individual, completely immersed in the world of words. He\'s always in a festive spirit, lighting up any room with his love for celebrations. But don’t let his poetic soul fool you, he’s a VERY short tempered and when it comes to driving, well, let\'s just say he’d probably give his car the same rough treatment as a scribbled margin note! Loves to throw stones at pigeons. '),(3,'Elliot','listening to music','learning something new','reading','playing video games',4,'2025-04-08 22:39:23','2025-04-11 03:30:54','Elliot.png','#FB6274','Elliot loves peanut butter and would even bathe in it if given the opportunity. DO NOT  bring your cats around Elliot because it will end up missing. He is unpredictable and finds an escape from life through beats. He loves to go to Raves. He is not a Swiftie. '),(6,'second test','[\"celebrating holidays\",\"cooking/baking\"]','[\"going out\",\"learning something new\"]','[\"listening to music\",\"playing sports\",\"playing video games\"]','[\"reading\",\"watching sports\"]',3,'2025-04-28 01:17:08','2025-04-28 01:17:08',NULL,NULL,'test !'),(8,'trying','[\"reading\",\"watching sports\"]','[\"listening to music\",\"playing sports\",\"playing video games\"]','[\"going out\",\"learning something new\"]','[\"celebrating holidays\",\"cooking/baking\"]',4,'2025-04-28 01:23:04','2025-04-28 01:23:04',NULL,NULL,'asfdg'),(10,'Molly ','playing video games','celebrating holidays, watching sports','cooking/baking, learning something new, listening to music','going out, playing sports, reading',6,'2025-04-28 07:06:23','2025-04-28 07:06:23',NULL,NULL,'Molly’s got a knack for finding the flaws in everything, no matter how shiny it looks on the outside. She’s picky with her preferences and doesn’t settle for just anything, even if others are all about it. While some might enjoy the hype of a holiday or a sports game, she’s quick to see the downside. Her laid-back exterior hides a mind that’s constantly questioning whether things are really worth her time. She’s hard to impress, but when she does find something she likes, it’s because it truly ticks all her boxes — and that’s not easy to do.');
/*!40000 ALTER TABLE `game_characters` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-04-28  2:35:53
