# EmailJS Beállítási Útmutató

Az email küldési funkcionalitás működéséhez be kell állítanod az EmailJS szolgáltatást. Ez egy ingyenes szolgáltatás, amely lehetővé teszi az email küldést JavaScript-ből.

## 1. EmailJS Fiók Létrehozása

1. Menj a [https://www.emailjs.com/](https://www.emailjs.com/) oldalra
2. Regisztrálj egy új fiókot vagy jelentkezz be
3. A dashboard-on létrehozhatod az email szolgáltatásaidat

## 2. Email Szolgáltatás Beállítása

1. A dashboard-on kattints az **"Add New Service"** gombra
2. Válaszd ki az email szolgáltatódat (Gmail, Outlook, stb.)
3. Add meg a szükséges adatokat:
   - **Service ID**: `service_portfolio` (ezt használja a kód)
   - **Email**: `sath_@outlook.hu` (ahova az emailek érkeznek)
   - **Password**: Az alkalmazás jelszavad (nem a fiókod jelszava!)

### Gmail esetén:
- Engedélyezd a 2-faktoros hitelesítést
- Generálj egy alkalmazás-specifikus jelszót
- Ezt add meg jelszóként

### Outlook esetén:
- Használd a Microsoft fiókod adatait
- Ha 2FA van bekapcsolva, alkalmazás jelszót kell generálni

## 3. Email Template-ek Létrehozása

Három template-et kell létrehoznod:

### A) Főoldal Kontakt Template
- **Template ID**: `template_main_contact`
- **Template neve**: "Main Contact Form"
- **Template tartalma**:
```
Új üzenet érkezett a portfólió oldaladról!

Név: {{from_name}}
Email: {{from_email}}

Üzenet:
{{message}}

---
Ez az üzenet a főoldal kontakt űrlapjából érkezett.
```

### B) Karrier Kontakt Template  
- **Template ID**: `template_career_contact`
- **Template neve**: "Career Contact Form"
- **Template tartalma**:
```
Új karrier megkeresés érkezett!

Cég/Név: {{from_name}}
Email: {{from_email}}
Típus: {{contact_type}}

Üzenet:
{{message}}

---
Ez az üzenet a karrier oldal kontakt űrlapjából érkezett.
```

### C) Automatikus Válasz Template
- **Template ID**: `template_auto_reply`
- **Template neve**: "Auto Reply"
- **Template tartalma**:
```
{{subject}}

{{message}}
```

## 4. Kulcsok Beállítása

1. A dashboard-on menj a **"Account"** > **"General"** részhez
2. Másold ki a **Public Key**-t
3. Nyisd meg a `js/email-service.js` fájlt
4. Cseréld ki a `YOUR_EMAILJS_PUBLIC_KEY` részt a valódi kulcsodra:

```javascript
this.emailjsPublicKey = 'your_actual_public_key_here';
```

## 5. Tesztelés

1. Mentsd el a változtatásokat
2. Nyisd meg a weboldalt böngészőben
3. Töltsd ki a kontakt űrlapot
4. Küldd el az üzenetet
5. Ellenőrizd az inbox-ot (sath_@outlook.hu)
6. Ellenőrizd, hogy az automatikus válasz megérkezett-e

## 6. Hibaelhárítás

### Gyakori problémák:

**"EmailJS nincs betöltve" hiba:**
- Ellenőrizd az internetkapcsolatot
- Győződj meg róla, hogy a script CDN elérhető

**"Invalid template ID" hiba:**
- Ellenőrizd, hogy a template ID-k egyeznek
- Győződj meg róla, hogy a template-ek publikálva vannak

**"Unauthorized" hiba:**
- Ellenőrizd a Public Key-t
- Győződj meg róla, hogy a szolgáltatás aktív

**Email nem érkezik meg:**
- Ellenőrizd a spam mappát
- Győződj meg róla, hogy a szolgáltatás email címe helyes
- Nézd meg az EmailJS dashboard activity log-ját

## 7. Költségek

EmailJS ingyenes csomag:
- 200 email/hónap
- 2 email szolgáltatás
- Alap támogatás

Ez elegendő a portfólió oldal igényeihez. Ha több email-re van szükség, válthatod fizetős csomagra.

## 8. Biztonsági Megjegyzések

- A Public Key nyilvános, nincs vele gond
- A Private Key-t soha ne tedd közzé
- Az email template-ekben ne tárolj érzékeny adatokat
- Az automatikus válaszokat tartalmilag mindig ellenőrizd

---

Ha minden beállítás kész, a kontakt űrlapok működőképesek lesznek és az emailek megérkeznek a sath_@outlook.hu címre, valamint automatikus válasz is megy a küldőnek. 