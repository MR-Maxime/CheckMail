const { checkEmailInSheet, updateEmailValidationStatus } = require('../googleSheets');
const { validateEmail } = require('../utils/emailValidator');

module.exports = {
  async handleEmailVerification(message) {
    console.log('Traitement de la vérification de l\'email');

    // Utiliser une expression régulière pour extraire un email du message
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
    const foundEmails = message.content.match(emailRegex);

    // Si aucun email n'est trouvé, informer l'utilisateur
    if (!foundEmails) {
      console.error('Aucun email trouvé dans le message.');
      return message.reply('Aucun email trouvé dans votre message. Veuillez inclure une adresse email.');
    }

    const email = foundEmails[0];
    console.log(`Email trouvé: ${email}`);

    // Valider le format de l'email
    if (!validateEmail(email)) {
      console.error('Format de l\'email invalide.');
      return message.reply('Le format de l\'email est invalide. Veuillez fournir une adresse email valide.');
    }
    console.log('Format de l\'email valide');

    // Vérifier dans le Google Sheet si l'email existe et s'il a déjà été validé
    const result = await checkEmailInSheet(email);
    if (!result.found) {
      console.error('Email non trouvé dans le sheet.');
      return message.reply('L\'email que vous avez fourni n\'est pas valide selon nos enregistrements.');
    }
    if (result.alreadyValidated) {
      console.error('Email déjà validé.');
      return message.reply('Cet email a déjà été vérifié et ne peut pas être réutilisé.');
    }
    console.log('L\'email est valide et n\'a pas encore été vérifié');

    // Rechercher le rôle à attribuer (ici, le rôle "Programmer")
    const role = message.guild.roles.cache.find(role => role.name === 'Programmer');
    if (!role) {
      console.error('Rôle "Programmer" introuvable.');
      return message.reply('Vérification réussie, mais le rôle n\'a pas pu être trouvé.');
    }
    console.log(`Rôle trouvé: ${role.name}`);

    try {
      // Récupérer le membre qui a envoyé le message
      const member = await message.guild.members.fetch(message.author.id);
      console.log(`Membre récupéré: ${member.user.tag}`);

      // Ajouter le rôle au membre
      await member.roles.add(role);
      console.log(`Rôle ${role.name} ajouté au membre ${member.user.tag}`);

      // Mettre à jour le statut de l'email dans le sheet pour le marquer comme validé ("oui")
      await updateEmailValidationStatus(email);
      message.reply('Votre email a été vérifié, le rôle a été attribué, et votre email a été marqué comme vérifié.');
    } catch (error) {
      console.error('Erreur lors de la récupération du membre ou de l\'attribution du rôle:', error);
      message.reply('Une erreur est survenue lors de l\'attribution de votre rôle.');
    }
  }
};
