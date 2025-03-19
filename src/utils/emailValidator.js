/**
 * Vérifie si l'email fourni correspond à un format d'email valide.
 *
 * Le format vérifié est le suivant :
 * - Au moins un caractère avant le symbole '@'
 * - Au moins un caractère entre le '@' et le point '.'
 * - Au moins un caractère après le point '.'
 * 
 * Les espaces et le symbole '@' ne sont pas autorisés dans les parties correspondantes.
 *
 * @param {string} email - L'email à valider.
 * @returns {boolean} - Retourne true si l'email est valide, sinon false.
 */
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  module.exports = { validateEmail };
  