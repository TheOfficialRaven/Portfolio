// Form validáció és kezelés
document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.contact-form');
  if (!form) return;

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

  // Hibaüzenetek
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
    if (name === 'email' && !rule.pattern.test(value)) {
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
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Küldés...';

    try {
      // Itt küldenéd el az adatokat a szerverre
      // Példa: await fetch('/api/contact', {...})
      
      // Sikeres küldés
      form.reset();
      showSuccess();
    } catch (error) {
      showError(submitBtn, 'Hiba történt a küldés során. Kérlek próbáld újra.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Üzenet elküldése';
    }
  });

  // Sikeres küldés üzenet
  function showSuccess() {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.innerHTML = `
      <i class="fas fa-check-circle"></i>
      Köszönjük üzeneted! Hamarosan válaszolunk.
    `;
    form.insertBefore(successDiv, form.firstChild);
    
    setTimeout(() => {
      successDiv.remove();
    }, 5000);
  }
}); 