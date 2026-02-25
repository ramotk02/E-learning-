-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Erstellungszeit: 25. Feb 2026 um 15:47
-- Server-Version: 10.4.32-MariaDB
-- PHP-Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Datenbank: `e-leraning`
--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `sessions`
--

CREATE TABLE `sessions` (
  `id` int(11) NOT NULL,
  `player_id` varchar(64) NOT NULL,
  `game` varchar(30) NOT NULL,
  `level` varchar(20) NOT NULL,
  `score` int(11) NOT NULL,
  `total` int(11) NOT NULL,
  `duration_sec` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Daten für Tabelle `sessions`
--

INSERT INTO `sessions` (`id`, `player_id`, `game`, `level`, `score`, `total`, `duration_sec`, `created_at`) VALUES
(19, '1', 'math', 'easy', 5, 5, 24, '2026-02-25 12:30:57'),
(20, '1', 'vocab', 'easy', 5, 5, 21, '2026-02-25 12:31:29'),
(21, '1', 'conjugation', 'easy', 3, 5, 44, '2026-02-25 12:32:47'),
(22, '1', 'math', 'easy', 5, 5, 26, '2026-02-25 12:51:16'),
(23, '1', 'vocab', 'easy', 4, 5, 24, '2026-02-25 12:51:56'),
(24, '1', 'vocab', 'easy', 4, 5, 26, '2026-02-25 12:54:47'),
(25, '1', 'math', 'easy', 7, 10, 52, '2026-02-25 12:55:48');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(40) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Daten für Tabelle `users`
--

INSERT INTO `users` (`id`, `username`, `password_hash`, `created_at`) VALUES
(1, 'Omartk', '$2b$10$u/dY.pm/tcO2WgcsiOBtN.eVu3J5i3exwf6RMvRJC4EeumTzf5d82', '2026-02-24 13:21:37');

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_player` (`player_id`),
  ADD KEY `idx_player_game` (`player_id`,`game`),
  ADD KEY `idx_created` (`created_at`);

--
-- Indizes für die Tabelle `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT für exportierte Tabellen
--

--
-- AUTO_INCREMENT für Tabelle `sessions`
--
ALTER TABLE `sessions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT für Tabelle `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
