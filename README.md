# Discord Bot TELP

## Description

**Discord Bot TELP** est un bot Discord conçu pour gérer les nouveaux membres entrant sur un serveur. Il demande aux nouveaux utilisateurs de répondre à une question ou de partager une image (comme une capture d’écran de leur jeu) et transmet ces réponses dans un canal administrateur.

## Fonctionnalités

- Accueille les nouveaux membres via un message privé (DM).
- Demande aux membres de répondre avec un texte ou une image.
- Transmet les réponses dans un canal administrateur désigné.
- Gère les réponses textuelles et les pièces jointes (comme des images).
- Configuration facile via un fichier `.env` pour stocker des informations sensibles.

## Installation

### Prérequis

- Un compte Discord.
- Un serveur Discord où vous pouvez ajouter un bot.
- Node.js installé sur votre machine (version 16.x ou supérieure).

### Étapes d'installation

1. **Clonez le dépôt** :
   ```bash
   git clone https://github.com/Baptistekeunbroek/Discord_BOT_TELP.git
   cd Discord_BOT_TELP
      2. **Installez les dépendances** :
      ```bash
      npm install
      ```

   3. **Créez un fichier `.env`** à la racine du projet et ajoutez vos informations sensibles. Exemple de fichier `.env` :

      ```dotenv
      DISCORD_TOKEN=your_discord_token_here
      ADMIN_CHANNEL_ID=your_admin_channel_id_here
      ```

      - `DISCORD_TOKEN` : Remplacez par votre jeton Discord (vous pouvez obtenir votre jeton depuis [le portail des développeurs Discord](https://discord.com/developers/applications)).
      - `ADMIN_CHANNEL_ID` : Remplacez par l'ID du canal où les réponses des membres seront envoyées (vous pouvez obtenir cet ID en activant le mode développeur sur Discord et en cliquant droit sur le canal).

   4. **Exécutez le bot** :
      ```bash
      node index.js
      ```

      Le bot se connectera alors à Discord et commencera à gérer les nouveaux membres.

## Fonctionnement

- Lorsque qu'un nouveau membre rejoint le serveur, le bot lui enverra un message privé lui demandant de répondre à une question ou de partager une image (ex. : une capture d'écran de son jeu).
- La réponse sera envoyée dans le canal administrateur que vous avez configuré dans le fichier `.env`.
- Le bot peut gérer à la fois des messages texte et des images envoyées par les nouveaux membres.
  
## Commandes

Aucune commande manuelle n'est nécessaire pour ce bot. Le bot fonctionne de manière autonome dès qu'un membre rejoint le serveur.

## Contribuer

1. Fork le projet.
2. Créez votre branche de fonctionnalité (`git checkout -b feature/ma-fonctionnalite`).
3. Commitez vos changements (`git commit -am 'Ajout de ma fonctionnalité'`).
4. Poussez votre branche (`git push origin feature/ma-fonctionnalite`).
5. Créez une nouvelle Pull Request.

## Licence

Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE) pour plus de détails.


   
