# Calculator Medie Ponderată ULBS (Simulator ECTS)

Aplicație web gratuită, modernă și securizată dedicată studenților Universității „Lucian Blaga” din Sibiu (ULBS) pentru calculul precis al mediei ponderate pe baza creditelor ECTS, simularea mediilor anuale și verificarea eligibilității pentru bursa universitară.

**Website Oficial (Producție):** [https://simulator-medie-ponderata.web.app](https://simulator-medie-ponderata.web.app)  
**Domeniu alternativ:** [https://simulator-medie-ponderata.firebaseapp.com](https://simulator-medie-ponderata.firebaseapp.com)  
**Versiune:** `v1.0.0` (Lansare Oficială)

---

## Ce face aplicația

- **Calcul Automat al Mediei Ponderate ECTS:** Calculează media semestrială și anuală conform formulei ponderate oficiale utilizate în învățământul universitar românesc (`Suma(Notă × Credite) / Suma(Credite)`), cu trunchiere exactă la două zecimale.
- **Planuri de Învățământ Integrate:** Materii, număr de credite ECTS și tipuri de examinare (examen, colocviu, verificare/proiect) structurate pe ani și semestre pentru specializări din cadrul ULBS (Calculatoare, Tehnologia Informației, Ingineria Sistemelor Multimedia, Management, Informatică, Matematică-Informatică etc.).
- **Gestionare Inteligentă a Disciplinelor Opționale:** Permite alegerea cursurilor opționale din pachetele curriculare, previne selectarea duplicatelor și activează introducerea notei exclusiv după selectarea opțiunii.
- **Simulator Statut Bursă:** Indicator vizual automat care analizează dacă media ponderată este mai mare sau egală cu 8.00 și dacă nu există nicio disciplină nepromovată (notă sub 5).
- **Sincronizare Cloud & Profil Student:** Salvare opțională securizată a notelor și a opțiunilor în baza de date Cloud Firestore, asociată adresei instituționale `@ulbsibiu.ro`, pentru a putea continua lucrul de pe orice dispozitiv (telefon, tabletă, laptop).
- **Mod Oaspete (Offline-first):** Aplicația poate fi utilizată complet fără autentificare, salvând datele local în memoria browserului (`localStorage`).
- **Aplicație Web Progresivă (PWA):** Suport pentru instalare directă pe ecranul principal al telefonului sau al calculatorului („Add to Home Screen” pe Android, iOS, Windows, macOS) cu pictograme dedicate și mod ecran complet.
- **Formular de Contact & Contribuție:** Sistem integrat de sesizare a discrepanțelor curriculare sau de propunere a planurilor de învățământ pentru facultățile și specializările în curs de colectare.
- **Conformitate GDPR & Confidențialitate:** Date personale minime, drept de ștergere definitivă a contului și a notelor din baza de date, fără colectare de date neesențiale.
- **Interfață Adaptivă & Dark Mode:** Suport complet pentru tema luminoasă și tema întunecată, adaptată designului academic.

---

## Tehnologii Utilizate

- **Frontend:** Angular 22 (Standalone Components, Signals, Computed state)
- **Stilizare:** Tailwind CSS v4 (design modern, academic, profesional)
- **Backend & Autentificare:** Firebase Authentication (cu validare a adresei instituționale `@ulbsibiu.ro`)
- **Bază de date:** Google Cloud Firestore (securizată cu reguli granulare de acces per utilizator)
- **Analitice:** Google Analytics / Firebase Analytics
- **Notificări Contact:** Integrare Web3Forms API
- **Testare:** Vitest (suită completă de 71 de teste unitare)
- **Găzduire:** Firebase Hosting (distribuție globală prin CDN cu certificat SSL automat)

---

## Contact & Autor

Proiect conceput și dezvoltat de:

- **Autor:** Andrei-Cătălin Colac
- **GitHub:** [@SNiF21](https://github.com/SNiF21)
- **Instagram:** [@snif21](https://www.instagram.com/snif21/)
- **Email:** [andi.cata4@gmail.com](mailto:andi.cata4@gmail.com)
- **Raportare Probleme & Sugestii:** Direct prin formularul de [Contact & Sesizări](https://simulator-medie-ponderata.web.app/contact) din aplicație sau prin deschiderea unui Issue în acest repository.

---

## Dezvoltare Locală (Setup)

### Cerințe prealabile
- Node.js (versiune LTS recomandată, v20+)
- npm (v10+)

### Pași de instalare

1. Clonează repository-ul:
   ```bash
   git clone https://github.com/SNiF21/MediePonderataULBS.git
   cd MediePonderataULBS
   ```

2. Instalează dependențele:
   ```bash
   npm install
   ```

3. Configurează mediul Firebase:
   - Copiază `src/environments/environment.example.ts` în `src/environments/environment.ts` și `src/environments/environment.prod.ts`.
   - Adaugă cheile proiectului tău Firebase.

4. Pornește serverul de dezvoltare:
   ```bash
   npm start
   # sau: ng serve
   ```
   Aplicația va fi accesibilă local la `http://localhost:4200/`.

5. Rularea suitei de teste:
   ```bash
   npm test
   # sau: npx ng test --no-watch
   ```

6. Compilare pentru producție:
   ```bash
   npm run build
   ```

---

## Disclaimer Legal

Această aplicație este un proiect independent, **neoficial și neafiliat** Universității „Lucian Blaga” din Sibiu (ULBS). Datele curriculare sunt extrase periodic din planurile de învățământ făcute publice de facultățile de profil. Aplicația este furnizată gratuit, ca instrument de sprijin și simulare pentru studenți.

---

## Licență

Acest proiect este licențiat sub termenii licenței **MIT**. Consultă fișierul [LICENSE.md](LICENSE.md) pentru detalii complete.
