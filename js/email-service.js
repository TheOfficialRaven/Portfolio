// EmailJS konfiguráció és email küldési szolgáltatás
class EmailService {
  constructor() {
    // EmailJS inicializálás
    this.emailjsPublicKey = '8wh1u4mfel2NptGgB'; // Ezt ki kell cserélni a valódi kulcsra
    this.serviceId = 'service_portfolio'; // EmailJS service ID
    this.mainTemplateId = 'template_main_contact'; // Főoldal template ID
    this.careerTemplateId = 'template_career_contact'; // Karrier template ID
    this.autoReplyTemplateId = 'template_auto_reply'; // Automatikus válasz template ID
    
    this.recipientEmail = 'sath_@outlook.hu';
    
    this.initEmailJS();
  }

  initEmailJS() {
    // EmailJS inicializálás amikor betöltődik a script
    if (typeof emailjs !== 'undefined') {
      emailjs.init(this.emailjsPublicKey);
    } else {
      console.error('EmailJS nincs betöltve');
    }
  }

  async sendMainContactEmail(formData) {
    try {
      // Főoldal kontakt email küldése
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        message: formData.message,
        to_email: this.recipientEmail,
        reply_to: formData.email
      };

      const response = await emailjs.send(
        this.serviceId,
        this.mainTemplateId,
        templateParams
      );

      // Automatikus válasz küldése
      await this.sendAutoReply(formData, 'main');

      alert(this.getSuccessMessage(formData.language || 'hu'));
      return { success: true, response };
    } catch (error) {
      alert(this.getErrorMessage(error, formData.language || 'hu'));
      console.error('Hiba a főoldal email küldésénél:', error);
      return { success: false, error };
    }
  }

  async sendCareerContactEmail(formData) {
    try {
      // Karrier oldal kontakt email küldése
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        message: formData.message,
        to_email: this.recipientEmail,
        reply_to: formData.email,
        contact_type: 'Karrier megkeresés'
      };

      const response = await emailjs.send(
        this.serviceId,
        this.careerTemplateId,
        templateParams
      );

      // Automatikus válasz küldése
      await this.sendAutoReply(formData, 'career');

      alert(this.getSuccessMessage(formData.language || 'hu'));
      return { success: true, response };
    } catch (error) {
      alert(this.getErrorMessage(error, formData.language || 'hu'));
      console.error('Hiba a karrier email küldésénél:', error);
      return { success: false, error };
    }
  }

  async sendAutoReply(formData, type) {
    try {
      let subject, message;
      
      if (type === 'main') {
        subject = 'Köszönöm a megkeresést!';
        message = `Kedves ${formData.name}!\n\nKöszönöm, hogy felkerestél! Üzeneted megérkezett hozzám, és hamarosan válaszolok rá.\n\nAddig is, ha sürgős kérdésed van, hívj fel nyugodtan a +36 30 123 4567 számon.\n\nÜdvözlettel,\nMark Gor\nFrontend Fejlesztő`;
      } else {
        subject = 'Köszönöm az érdeklődést!';
        message = `Kedves ${formData.name}!\n\nKöszönöm az érdeklődést a szolgáltatásaim iránt! Üzeneted megérkezett, és hamarosan felveszem Önökkel a kapcsolatot.\n\nMunkáim és referenciáim megtekinthetők a portfólió oldalamon. Ha sürgős kérdésük van, hívjanak fel nyugodtan a +36 30 123 4567 számon.\n\nÜdvözlettel,\nMark Gor\nFrontend Fejlesztő`;
      }

      const autoReplyParams = {
        to_email: formData.email,
        to_name: formData.name,
        subject: subject,
        message: message,
        reply_to: this.recipientEmail
      };

      await emailjs.send(
        this.serviceId,
        this.autoReplyTemplateId,
        autoReplyParams
      );

      console.log('Automatikus válasz elküldve');
    } catch (error) {
      console.error('Hiba az automatikus válasz küldésénél:', error);
    }
  }

  // Hibaüzenetek lokalizálása
  getErrorMessage(error, language = 'hu') {
    const messages = {
      hu: {
        network: 'Hálózati hiba történt. Kérlek ellenőrizd az internetkapcsolatod.',
        validation: 'Kérlek töltsd ki az összes mezőt helyesen.',
        server: 'Szerver hiba történt. Kérlek próbáld újra később.',
        unknown: 'Ismeretlen hiba történt. Kérlek próbáld újra.',
        success: 'Üzeneted sikeresen elküldve! Hamarosan válaszolunk.'
      },
      en: {
        network: 'Network error occurred. Please check your internet connection.',
        validation: 'Please fill all fields correctly.',
        server: 'Server error occurred. Please try again later.',
        unknown: 'Unknown error occurred. Please try again.',
        success: 'Your message has been sent successfully! We will respond soon.'
      },
      de: {
        network: 'Netzwerkfehler aufgetreten. Bitte überprüfen Sie Ihre Internetverbindung.',
        validation: 'Bitte füllen Sie alle Felder korrekt aus.',
        server: 'Serverfehler aufgetreten. Bitte versuchen Sie es später erneut.',
        unknown: 'Unbekannter Fehler aufgetreten. Bitte versuchen Sie es erneut.',
        success: 'Ihre Nachricht wurde erfolgreich gesendet! Wir werden bald antworten.'
      }
    };

    if (error.status === 400 || error.status === 422) {
      return messages[language].validation;
    } else if (error.status >= 500) {
      return messages[language].server;
    } else if (error.name === 'NetworkError' || !navigator.onLine) {
      return messages[language].network;
    } else {
      return messages[language].unknown;
    }
  }

  getSuccessMessage(language = 'hu') {
    const messages = {
      hu: 'Üzeneted sikeresen elküldve! Hamarosan válaszolunk.',
      en: 'Your message has been sent successfully! We will respond soon.',
      de: 'Ihre Nachricht wurde erfolgreich gesendet! Wir werden bald antworten.'
    };
    return messages[language];
  }
}

// Global példány létrehozása
window.emailService = new EmailService();

export default EmailService; 