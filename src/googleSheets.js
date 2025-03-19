// Importer l'API Google et initialiser le service Sheets (version 4)
const { google } = require('googleapis');
const sheets = google.sheets('v4');

/**
 * Autorise l'accès à l'API Google Sheets en utilisant un compte de service.
 * Les informations d'identification sont stockées dans les variables d'environnement.
 *
 * @returns {Promise<google.auth.JWT>} L'objet d'authentification.
 */
async function authorize() {
  const auth = new google.auth.JWT(
    process.env.GOOGLE_CLIENT_EMAIL,                        // Email du compte de service
    null,                                                   // Aucun fichier de clé, utilisation directe de la clé privée
    process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),    // Clé privée avec correction des sauts de ligne
    ['https://www.googleapis.com/auth/spreadsheets']        // Portée d'accès aux Google Sheets
  );
  await auth.authorize(); // Autorise la connexion
  return auth;
}

/**
 * Vérifie si un email est présent dans le Google Sheet et s'il a déjà été validé.
 *
 * On suppose que la première ligne du sheet est un en-tête.
 * Les emails se trouvent dans la colonne A et le statut dans la colonne B.
 *
 * @param {string} email L'email à rechercher.
 * @returns {Promise<{found: boolean, alreadyValidated: boolean}>}
 *          Un objet indiquant si l'email a été trouvé et, le cas échéant, si le statut est "oui".
 */
async function checkEmailInSheet(email) {
  const auth = await authorize();
  const response = await sheets.spreadsheets.values.get({
    auth,
    spreadsheetId: process.env.GOOGLE_SHEET_ID, // ID de la feuille
    range: "Sheet1!A:B",                        // Lire les colonnes A et B (incluant l'en-tête)
  });

  const rows = response.data.values || [];
  
  // Boucler en ignorant la première ligne (en-tête)
  for (let i = 1; i < rows.length; i++) {
    const rowEmail = rows[i][0] ? rows[i][0].trim().toLowerCase() : '';
    const status = rows[i][1] ? rows[i][1].trim().toLowerCase() : 'non';
    console.log(`Sheet row ${i + 1}: email=${rowEmail}, status=${status}`);
    
    // Comparer l'email recherché avec l'email de la ligne
    if (rowEmail === email.toLowerCase()) {
      return { found: true, alreadyValidated: status === 'oui' };
    }
  }
  
  return { found: false, alreadyValidated: false };
}

/**
 * Met à jour le statut d'un email dans le Google Sheet en le marquant comme validé ("oui").
 *
 * On cherche l'email dans la feuille (en ignorant l'en-tête) et on met à jour la cellule correspondante de la colonne B.
 *
 * @param {string} email L'email à mettre à jour.
 * @throws {Error} Si l'email n'est pas trouvé dans la feuille.
 */
async function updateEmailValidationStatus(email) {
  const auth = await authorize();
  const response = await sheets.spreadsheets.values.get({
    auth,
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: process.env.GOOGLE_SHEET_RANGE, // Par exemple "Sheet1!A:B"
  });
  const rows = response.data.values || [];
  
  let rowIndex = -1;
  // Parcourir les lignes en ignorant la première ligne (en-tête)
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][0] && rows[i][0].trim().toLowerCase() === email.toLowerCase()) {
      rowIndex = i + 1; // +1 pour obtenir le numéro de ligne tel qu'utilisé dans Google Sheets
      break;
    }
  }
  
  if (rowIndex === -1) {
    throw new Error('Email not found in the sheet');
  }
  
  // Construire la plage de la cellule à mettre à jour (par exemple "Sheet1!B2")
  const range = `${process.env.GOOGLE_SHEET_NAME}!B${rowIndex}`;
  
  // Mettre à jour la cellule avec l'option 'USER_ENTERED' pour que Sheets interprète la valeur
  const updateResponse = await sheets.spreadsheets.values.update({
    auth,
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: range,
    valueInputOption: 'USER_ENTERED',
    resource: {
      values: [['oui']], // Marquer l'email comme validé
    },
  });
  
  console.log(`Updated row ${rowIndex} for email ${email}:`, updateResponse.status);
  
  // Attendre 3 secondes pour s'assurer que la mise à jour est propagée
  await new Promise(resolve => setTimeout(resolve, 3000));
}

module.exports = { checkEmailInSheet, updateEmailValidationStatus };
