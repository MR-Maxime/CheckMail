// Charger les variables d'environnement depuis le fichier .env
require('dotenv').config();

// Importer les classes nécessaires de discord.js
const { Client, GatewayIntentBits } = require('discord.js');
// Importer la fonction de vérification d'email depuis le module "commands"
const { handleEmailVerification } = require('./commands');

// Créer une instance du client Discord avec les intents requis
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,              // Pour recevoir des événements sur les serveurs
    GatewayIntentBits.GuildMessages,       // Pour recevoir les messages dans les salons textuels
    GatewayIntentBits.MessageContent,      // Pour accéder au contenu des messages
    GatewayIntentBits.GuildMembers         // Pour récupérer les informations sur les membres (nécessaire pour ajouter des rôles)
  ]
});

// Lorsque le bot est prêt, afficher un message dans la console
client.once('ready', () => {
  console.log(`Connecté en tant que ${client.user.tag}!`);
});

// Écouter l'événement 'messageCreate' pour traiter chaque message envoyé
client.on('messageCreate', async (message) => {
  console.log(`Message reçu: ${message.content}`); // Afficher le contenu du message pour le débogage

  // Vérifier que le message provient du canal désigné (via son ID) et qu'il n'est pas envoyé par un bot
  if (message.channel.id === '1096766890539483198' && !message.author.bot) {
    console.log('Le message provient du canal désigné et n\'est pas d\'un bot');
    try {
      // Appeler la fonction qui gère la vérification d'email pour ce message
      await handleEmailVerification(message);
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'email:', error);
      message.reply('Une erreur est survenue lors du traitement de votre demande.');
    }
  }
});

// Connecter le bot à Discord en utilisant le token défini dans le fichier .env
client.login(process.env.DISCORD_TOKEN).catch(console.error);
