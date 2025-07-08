// Form validáció és kezelés EmailJS integrációval
import EmailService from './email-service.js';

document.addEventListener('DOMContentLoaded', () => {
  // Főoldal kontakt űrlap kezelése
  const mainForm = document.querySelector('.contact-form:not(#career-contact-form)');
  if (mainForm) {
    initializeForm(mainForm, 'main');
  }

  // Karrier oldal kontakt űrlap kezelése
  const careerForm = document.querySelector('#career-contact-form');
  if (careerForm) {
    initializeForm(careerForm, 'career');
  }
});

function initializeForm(form, formType) {
  const inputs = form.querySelectorAll('input, textarea');
  const submitBtn = form.querySelector('button[type="submit"]');

  // Validációs szabályok
  const rules = {
    name: {
      required: true,
      minLength: 2,
      maxLength: 50
    },
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    message: {
      required: true,
      minLength: 10,
      maxLength: 1000
    }
  };

  // Hibaüzenetek (alapértelmezett magyar)
  const errorMessages = {
    required: 'Ez a mező kötelező',
    email: 'Kérlek adj meg egy érvényes email címet',
    minLength: (min) => `Minimum ${min} karakter szükséges`,
    maxLength: (max) => `Maximum ${max} karakter engedélyezett`
  };

  // Input validáció
  function validateInput(input) {
    const value = input.value.trim();
    const name = input.name;
    const rule = rules[name];
    
    if (!rule) return true;

    // Required check
    if (rule.required && !value) {
      showError(input, errorMessages.required);
      return false;
    }

    // Email pattern check
    if (name === 'email' && value && !rule.pattern.test(value)) {
      showError(input, errorMessages.email);
      return false;
    }

    // Length checks
    if (rule.minLength && value.length < rule.minLength) {
      showError(input, errorMessages.minLength(rule.minLength));
      return false;
    }
    if (rule.maxLength && value.length > rule.maxLength) {
      showError(input, errorMessages.maxLength(rule.maxLength));
      return false;
    }

    clearError(input);
    return true;
  }

  // Hibaüzenet megjelenítése
  function showError(input, message) {
    clearError(input);
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    input.parentNode.appendChild(errorDiv);
    input.classList.add('error');
  }

  // Hibaüzenet törlése
  function clearError(input) {
    const parent = input.parentNode;
    const error = parent.querySelector('.error-message');
    if (error) {
      error.remove();
      input.classList.remove('error');
    }
  }

  // Input események
  inputs.forEach(input => {
    input.addEventListener('blur', () => validateInput(input));
    input.addEventListener('input', () => {
      if (input.classList.contains('error')) {
        validateInput(input);
      }
    });
  });

  // Aktuális nyelv meghatározása
  function getCurrentLanguage() {
    const langBtn = document.querySelector('.lang-btn.active') || 
                   document.querySelector('.lang-btn[data-lang="hu"]');
    return langBtn ? langBtn.getAttribute('data-lang') : 'hu';
  }

  // Submit gomb szövegének frissítése
  function updateSubmitButtonText(text) {
    const originalText = submitBtn.textContent;
    submitBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${text}`;
    return originalText;
  }

  // Form submit
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Minden mező validálása
    let isValid = true;
    inputs.forEach(input => {
      if (!validateInput(input)) {
        isValid = false;
      }
    });

    if (!isValid) return;

    // Submit button állapot
    submitBtn.disabled = true;
    const originalBtnText = updateSubmitButtonText('Küldés...');

    try {
      // Form adatok összegyűjtése
      const formData = {
        name: form.querySelector('[name="name"]').value.trim(),
        email: form.querySelector('[name="email"]').value.trim(),
        message: form.querySelector('[name="message"]').value.trim()
      };

      let result;
      
      // Email küldése a megfelelő szolgáltatással
      if (window.emailService) {
        if (formType === 'main') {
          result = await window.emailService.sendMainContactEmail(formData);
        } else {
          result = await window.emailService.sendCareerContactEmail(formData);
        }
      } else {
        throw new Error('Email szolgáltatás nem érhető el');
      }

      if (result.success) {
        // Sikeres küldés
        form.reset();
        showSuccess(formType);
        
        // Analytics esemény (ha van)
        if (typeof gtag !== 'undefined') {
          gtag('event', 'form_submit', {
            event_category: 'contact',
            event_label: formType,
            value: 1
          });
        }
      } else {
        throw result.error;
      }
    } catch (error) {
      console.error('Email küldési hiba:', error);
      const currentLang = getCurrentLanguage();
      const errorMessage = window.emailService ? 
        window.emailService.getErrorMessage(error, currentLang) :
        'Hiba történt az üzenet küldése során. Kérlek próbáld újra később.';
      
      showError(submitBtn, errorMessage);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalBtnText;
    }
  });

  // Sikeres küldés üzenet
  function showSuccess(type) {
    const currentLang = getCurrentLanguage();
    const successMessage = window.emailService ? 
      window.emailService.getSuccessMessage(currentLang) :
      'Köszönjük üzeneted! Hamarosan válaszolunk.';

    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.innerHTML = `
      <i class="fas fa-check-circle"></i>
      ${successMessage}
    `;
    
    // Üzenet beszúrása a form elé
    form.parentNode.insertBefore(successDiv, form);
    
    // Smooth scroll a success üzenethez
    successDiv.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'center' 
    });
    
    // Automatikus eltávolítás 8 másodperc után
    setTimeout(() => {
      if (successDiv.parentNode) {
        successDiv.style.opacity = '0';
        successDiv.style.transform = 'translateY(-10px)';
        setTimeout(() => successDiv.remove(), 300);
      }
    }, 8000);
  }

  // Form reset extra funkciókkal
  function resetFormWithEffects() {
    // Animáció a reset előtt
    form.style.opacity = '0.7';
    setTimeout(() => {
      form.reset();
      inputs.forEach(clearError);
      form.style.opacity = '1';
    }, 200);
  }

  // Escape gomb lenyomására reset
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.activeElement && form.contains(document.activeElement)) {
      resetFormWithEffects();
    }
  });
} 