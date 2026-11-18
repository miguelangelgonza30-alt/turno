(function (root) {
  'use strict';

  // Each row is ordered es, it, en. Spanish is the source text.
  var idiomas = ['es', 'it', 'en'];
  var textos = {
    hoursControl: ["Control de horas", "Registro ore", "Time tracking"],
    language: ["Idioma", "Lingua", "Language"],
    logout: ["Cerrar sesión", "Esci", "Log out"],
    changePhoto: ["Añadir o cambiar foto", "Aggiungi o cambia la foto", "Add or change photo"],
    employeeLogin: ["Acceso de empleados", "Accesso dipendenti", "Employee sign-in"],
    loginIntro: ["Identifícate con tu ID y tu PIN para registrar tu jornada.", "Accedi con il tuo ID e il tuo PIN per registrare il turno.", "Sign in with your ID and PIN to log your shift."],
    employeeId: ["ID de empleado", "ID dipendente", "Employee ID"],
    idExample: ["Ejemplo: 101", "Esempio: 101", "Example: 101"],
    signIn: ["Entrar", "Accedi", "Sign in"],
    newEmployeeButton: ["Soy nuevo empleado", "Sono un nuovo dipendente", "I'm a new employee"],
    newEmployee: ["Nuevo empleado", "Nuovo dipendente", "New employee"],
    registerIntro: ["Completa tus datos. Te enviaremos un código a tu correo para confirmar el registro.", "Inserisci i tuoi dati. Ti invieremo un codice via email per confermare la registrazione.", "Enter your details. We'll email you a code to confirm your registration."],
    companyCode: ["Código de la empresa", "Codice aziendale", "Company code"],
    askSupervisor: ["Te lo da tu supervisor", "Chiedilo al tuo responsabile", "Ask your supervisor"],
    firstName: ["Nombre", "Nome", "First name"],
    lastName: ["Apellido", "Cognome", "Last name"],
    email: ["Correo electrónico", "Email", "Email"],
    emailExample: ["nombre@correo.com", "nome@esempio.it", "name@example.com"],
    phone: ["Teléfono", "Telefono", "Phone number"],
    createPin: ["Crea tu PIN", "Crea il tuo PIN", "Create a PIN"],
    pinLength: ["4 a 8 cifras", "Da 4 a 8 cifre", "4 to 8 digits"],
    repeatPin: ["Repite el PIN", "Ripeti il PIN", "Repeat PIN"],
    privacy: ["Aviso de privacidad", "Informativa sulla privacy", "Privacy notice"],
    controller: ["Responsable:", "Titolare del trattamento:", "Data controller:"],
    yourCompany: ["tu empresa", "la tua azienda", "your company"],
    dataStored: ["Datos que se guardan:", "Dati conservati:", "Data we store:"],
    dataStoredBody: ["nombre, correo, teléfono, foto (opcional) y tus horarios de entrada, salida y pausa.", "nome, email, telefono, foto (facoltativa) e orari di entrata, uscita e pausa.", "name, email, phone number, photo (optional), and your start, finish and break times."],
    dataPurpose: ["Para qué:", "Finalità:", "Purpose:"],
    dataPurposeBody: ["llevar el control de tu jornada y de tus horas extra.", "registrare i tuoi turni e le ore di straordinario.", "to track your shifts and overtime."],
    dataAccess: ["Quién los ve:", "Chi può accedere ai dati:", "Who can see it:"],
    dataAccessBody: ["solo tu empresa y sus supervisores. No se ceden a terceros.", "solo la tua azienda e i suoi responsabili. I dati non vengono ceduti a terzi.", "only your company and its supervisors. We do not share your data with third parties."],
    dataRetention: ["Cuánto tiempo:", "Conservazione:", "Retention:"],
    dataRetentionBody: ["mientras trabajes en la empresa y el plazo que exija la ley laboral.", "per la durata del rapporto di lavoro e per il periodo previsto dalla normativa sul lavoro.", "for the duration of your employment and for the period required by labour law."],
    dataRights: ["Tus derechos:", "I tuoi diritti:", "Your rights:"],
    dataRightsBody: ["puedes pedir a tu empresa ver, corregir o borrar tus datos.", "puoi chiedere alla tua azienda di accedere ai tuoi dati, rettificarli o cancellarli.", "you can ask your company to access, correct or delete your data."],
    privacyAccept: ["He leído el aviso de privacidad y acepto el uso de mis datos para el control de horas.", "Ho letto l'informativa sulla privacy e acconsento all'uso dei miei dati per la registrazione delle ore.", "I have read the privacy notice and agree to the use of my data for time tracking."],
    sendCode: ["Enviar código", "Invia codice", "Send code"],
    sixDigits: ["Código de 6 cifras", "Codice di 6 cifre", "6-digit code"],
    confirmRegistration: ["Confirmar registro", "Conferma registrazione", "Confirm registration"],
    correctDetails: ["Corregir mis datos", "Correggi i miei dati", "Edit my details"],
    haveId: ["Ya tengo ID", "Ho già un ID", "I already have an ID"],
    logShift: ["Registrar jornada", "Registra il turno", "Log a shift"],
    shiftIntro: ["Elige el día y tu horario. Cada día se registra una sola vez.", "Scegli il giorno e l'orario del turno. Puoi registrare ogni giorno una sola volta.", "Choose the date and your shift times. You can log each day once."],
    date: ["Fecha", "Data", "Date"],
    dayOff: ["Día libre", "Giorno libero", "Day off"],
    dayOffHelp: ["Márcalo si hoy descansas", "Seleziona se oggi non lavori", "Select if you're off today"],
    start: ["Entrada", "Entrata", "Start time"],
    end: ["Salida", "Uscita", "Finish time"],
    splitShift: ["Turno partido", "Turno spezzato", "Split shift"],
    splitHelp: ["Dos tramos el mismo día", "Due fasce orarie nello stesso giorno", "Two work periods on the same day"],
    startSecond: ["Entrada 2.ª parte", "Entrata 2ª parte", "Second start time"],
    endSecond: ["Salida 2.ª parte", "Uscita 2ª parte", "Second finish time"],
    break: ["Pausa", "Pausa", "Break"],
    noBreak: ["Sin pausa", "Senza pausa", "No break"],
    halfHour: ["30 minutos", "30 minuti", "30 minutes"],
    oneHour: ["1 hora", "1 ora", "1 hour"],
    save: ["Guardar", "Salva", "Save"],
    myWeek: ["Mi semana", "La mia settimana", "My week"],
    outOf: ["de", "su", "of"],
    overtime: ["Extra", "Extra", "Extra"],
    day: ["Día", "Giorno", "Day"],
    schedule: ["Horario", "Orario", "Shift"],
    hours: ["Horas", "Ore", "Hours"],
    supervisorArea: ["Área del supervisor", "Area responsabili", "Supervisor area"],
    supervisorIntro: ["Consulta el control de horas de todo el equipo.", "Consulta le ore di tutto il team.", "View recorded hours for the whole team."],
    password: ["Contraseña", "Password", "Password"],
    employee: ["Empleado", "Dipendente", "Employee"],
    month: ["Mes", "Mese", "Month"],
    viewHours: ["Ver control de horas", "Visualizza le ore", "View timesheets"],
    forgotPassword: ["Olvidé la contraseña", "Ho dimenticato la password", "I forgot my password"],
    codeReceived: ["Código recibido por correo", "Codice ricevuto via email", "Code from your email"],
    newPassword: ["Nueva contraseña (mínimo 8 caracteres)", "Nuova password (almeno 8 caratteri)", "New password (at least 8 characters)"],
    changePassword: ["Cambiar contraseña", "Cambia password", "Change password"],
    employees: ["Empleados", "Dipendenti", "Employees"],
    employeeSummaries: ["Resumen por empleado", "Riepilogo per dipendente", "Summary by employee"],
    days: ["Días", "Giorni", "Days"],
    daysOff: ["Libres", "Giorni liberi", "Days off"],
    regularHours: ["Normales", "Ordinarie", "Regular hours"],
    monthlyRecords: ["Registros del mes", "Registrazioni del mese", "Monthly records"],
    employeeRegistration: ["Alta de empleados", "Registrazione dipendenti", "Employee registration"],
    inviteHelp: ["Da este código a cada empleado nuevo. Sin él nadie puede registrarse.", "Dai questo codice a ogni nuovo dipendente. Serve per registrarsi.", "Give this code to each new employee. They'll need it to register."],
    sendPayroll: ["Enviar a la gestoría", "Invia al consulente del lavoro", "Send to payroll"],
    exportHelp: ["Recibe en el correo del supervisor el resumen del mes en un archivo que se abre con Excel.", "Ricevi il riepilogo mensile all'indirizzo email del responsabile in un file apribile con Excel.", "Receive the monthly summary at the supervisor's email address in a file you can open in Excel."],
    sendSummary: ["Enviar resumen del mes a mi correo", "Invia il riepilogo mensile alla mia email", "Email me the monthly summary"],
    backToLog: ["Volver al registro", "Torna al registro ore", "Back to shift log"],
    help: ["Ayuda", "Aiuto", "Help"],
    helpIntro: ["Toca tu problema para ver la solución. Si no se resuelve, envíanos un reporte más abajo.", "Tocca il problema per vedere la soluzione. Se il problema persiste, inviaci una segnalazione qui sotto.", "Tap an issue to see how to fix it. If it persists, send us a report below."],
    forgotPin: ["Olvidé mi PIN o mi ID", "Ho dimenticato il PIN o l'ID", "I forgot my PIN or ID"],
    forgotPinHelp: ["Te enviamos un correo con tu ID y un código para crear un PIN nuevo. Usa el correo con el que te registraste.", "Ti invieremo un'email con il tuo ID e un codice per creare un nuovo PIN. Usa l'indirizzo email con cui ti sei registrato.", "We'll email you your ID and a code to create a new PIN. Use the address you registered with."],
    yourEmail: ["Tu correo electrónico", "La tua email", "Your email address"],
    newPin: ["PIN nuevo", "Nuovo PIN", "New PIN"],
    changePin: ["Cambiar PIN", "Cambia PIN", "Change PIN"],
    driveError: ["Al abrir la app sale un error de Google Drive", "Quando apro l'app compare un errore di Google Drive", "I see a Google Drive error when I open the app"],
    driveHelp: ["Pasa cuando el teléfono tiene varias cuentas de Google abiertas. Abre el enlace en una pestaña de incógnito, o en otro navegador donde no tengas sesiones de Google.", "Succede quando sul telefono hai effettuato l'accesso a più account Google. Apri il link in una scheda in incognito o in un altro browser in cui non hai effettuato l'accesso a Google.", "This can happen when you're signed in to several Google accounts on your phone. Open the link in a private tab or in a different browser where you aren't signed in to Google."],
    wrongPin: ["Pongo mi PIN y dice que es incorrecto", "L'app dice che il mio PIN è errato", "The app says my PIN is incorrect"],
    wrongPinHelp: ["Comprueba que el ID es el tuyo y que el PIN no tiene espacios. Tras 5 intentos fallidos el acceso se bloquea 15 minutos. Si no lo recuerdas, usa \"Olvidé mi PIN o mi ID\", aquí arriba.", "Verifica che l'ID sia il tuo e che il PIN non contenga spazi. Dopo 5 tentativi falliti, l'accesso viene bloccato per 15 minuti. Se non ricordi il PIN, usa «Ho dimenticato il PIN o l'ID» qui sopra.", "Check that you're using your own ID and that your PIN has no spaces. After 5 failed attempts, access is blocked for 15 minutes. If you can't remember your PIN, use “I forgot my PIN or ID” above."],
    wrongShift: ["Me equivoqué al registrar un día", "Ho registrato un turno con dati sbagliati", "I made a mistake when logging a shift"],
    wrongShiftHelp: ["Cada día se registra una sola vez y no se puede cambiar desde el teléfono. Avisa a tu supervisor, que puede corregirlo, o envía un reporte indicando el día y el horario correcto.", "Puoi registrare ogni giorno una sola volta e non puoi modificarlo dal telefono. Chiedi al tuo responsabile di correggerlo oppure invia una segnalazione con la data e l'orario corretto.", "You can only log each day once, and you can't change it from your phone. To correct a record, ask your supervisor or send a report with the date and correct shift times."],
    missingCode: ["No me llega el código al correo", "Non ricevo il codice via email", "I haven't received my code by email"],
    missingCodeHelp: ["Mira en la carpeta de spam o correo no deseado. El código puede tardar un minuto y solo se puede pedir uno cada 2 minutos. Revisa también que escribiste bien tu correo.", "Controlla la cartella spam o posta indesiderata. Il codice può metterci fino a un minuto ad arrivare e puoi richiederne uno ogni 2 minuti. Verifica anche di aver digitato correttamente il tuo indirizzo email.", "Check your spam or junk folder. The code can take up to a minute to arrive, and you can request one every 2 minutes. Check that you entered your email address correctly."],
    supervisorForgot: ["Soy supervisor y olvidé la contraseña", "Sono un responsabile e ho dimenticato la password", "I'm a supervisor and forgot my password"],
    supervisorForgotHelp: ["Entra en \"Acceso del supervisor\" y toca \"Olvidé la contraseña\". Recibirás un código en el correo del supervisor para crear una nueva.", "Apri «Accesso responsabili» e tocca «Ho dimenticato la password». Riceverai un codice all'indirizzo email del responsabile per creare una nuova password.", "Open “Supervisor sign-in” and tap “I forgot my password”. We'll email a code to the supervisor's address so you can set a new password."],
    reportHeading: ["Enviar un reporte", "Invia una segnalazione", "Report an issue"],
    reportIntro: ["Cuéntanos qué ocurre y lo revisaremos.", "Descrivi il problema e lo esamineremo.", "Tell us what's happening and we'll look into it."],
    issueType: ["Tipo de problema", "Tipo di problema", "Issue type"],
    pinOrPassword: ["PIN o contraseña", "PIN o password", "PIN or password"],
    signInIssue: ["Inicio de sesión", "Accesso", "Sign-in"],
    timeLogIssue: ["Registro de horas", "Registrazione delle ore", "Logging hours"],
    otherIssue: ["Otro", "Altro", "Other"],
    issueDescription: ["¿Qué ocurre?", "Cosa succede?", "What's happening?"],
    reportExample: ["Ejemplo: pongo mi PIN correcto y me dice que es incorrecto.", "Esempio: inserisco il PIN corretto, ma l'app dice che è errato.", "Example: The app rejects my PIN even though I entered it correctly."],
    replyContact: ["Correo o teléfono para responderte", "Email o telefono per ricontattarti", "Email or phone number for a reply"],
    optional: ["Opcional", "Facoltativo", "Optional"],
    sendReport: ["Enviar reporte", "Invia segnalazione", "Send report"],
    back: ["Volver", "Indietro", "Back"],
    supervisorLogin: ["Acceso del supervisor", "Accesso responsabili", "Supervisor sign-in"],
    footer: ["Turno · Control de horas", "Turno · Registro ore", "Turno · Time tracking"],
    installTurno: ["Instalar Turno", "Installa Turno", "Install Turno"],
    installHelp: ["En Android o Chrome, abre el menú del navegador y elige «Instalar aplicación». En iPhone o iPad, abre esta página en Safari, pulsa Compartir y «Añadir a la pantalla de inicio».", "Su Android o su Chrome, apri il menu del browser e scegli «Installa app». Su iPhone o iPad, apri questa pagina in Safari, tocca Condividi e scegli «Aggiungi alla schermata Home».", "On Android or in Chrome, open the browser menu and choose “Install app”. On iPhone or iPad, open this page in Safari, tap Share and choose “Add to Home Screen”."],
    installOffline: ["Se necesita conexión para consultar o guardar horas. Los registros no se guardan sin conexión.", "È necessaria una connessione per consultare o registrare le ore. Le registrazioni non vengono salvate offline.", "You need an internet connection to view or save hours. Records are not saved offline."],
    installApp: ["Instalar aplicación", "Installa app", "Install app"],
    logoutQuestion: ["¿Cerrar sesión?", "Vuoi uscire?", "Log out?"],
    logoutHelp: ["Se va a cerrar tu sesión en este teléfono.", "Stai per uscire dal tuo account su questo telefono.", "You'll be signed out on this phone."],
    cancel: ["Cancelar", "Annulla", "Cancel"],
    accept: ["Aceptar", "Conferma", "Confirm"],
    photoSaveError: ["No se pudo guardar la foto.", "Impossibile salvare la foto.", "Couldn't save the photo."],
    invalidDate: ["Fecha no válida.", "Data non valida.", "Invalid date."],
    dateOutOfRange: ["La fecha está fuera del periodo permitido.", "La data è fuori dal periodo consentito.", "The date is outside the allowed range."],
    chooseTimes: ["Elige la hora de entrada y de salida.", "Scegli l'orario di entrata e di uscita.", "Choose a start and finish time."],
    chooseBreak: ["Elige la pausa.", "Scegli la pausa.", "Choose a break length."],
    chooseSecondTimes: ["Elige la entrada y la salida de la segunda parte.", "Scegli l'entrata e l'uscita della seconda parte del turno.", "Choose the start and finish times for the second part of the shift."],
    secondTooEarly: ["La segunda parte debe empezar después de terminar la primera.", "La seconda parte deve iniziare dopo la fine della prima.", "The second part must start after the first part ends."],
    shiftTooLong: ["El turno completo no puede durar más de 24 horas.", "Il turno completo non può durare più di 24 ore.", "The full shift cannot last more than 24 hours."],
    breakTooLong: ["La pausa no puede ser mayor que el turno.", "La pausa non può durare più del turno.", "The break cannot be longer than the shift."],
    alreadyLoggedError: ["Ese día ya está registrado. Si hay un error, avisa al supervisor.", "Quel giorno è già stato registrato. Se c'è un errore, avvisa il tuo responsabile.", "That day is already logged. If there's a mistake, tell your supervisor."],
    invalidName: ["Escribe tu nombre y tu apellido (solo letras).", "Inserisci nome e cognome (solo lettere).", "Enter your first and last name (letters only)."],
    invalidEmail: ["Escribe un correo electrónico válido.", "Inserisci un indirizzo email valido.", "Enter a valid email address."],
    invalidPhone: ["Escribe tu teléfono sin el +39, solo números.", "Inserisci il tuo numero di telefono senza il +39, usando solo cifre.", "Enter your phone number without +39, using digits only."],
    invalidPin: ["El PIN debe tener de 4 a 8 cifras.", "Il PIN deve avere da 4 a 8 cifre.", "Your PIN must be 4 to 8 digits long."],
    weakPin: ["Ese PIN es demasiado fácil de adivinar. Elige otro (no 1234 ni 1111).", "Questo PIN è troppo facile da indovinare. Scegline un altro (evita 1234 e 1111).", "That PIN is too easy to guess. Choose another one and avoid codes like 1234 or 1111."],
    privacyRequired: ["Debes aceptar el aviso de privacidad para registrarte.", "Per registrarti, devi accettare l'informativa sulla privacy.", "You must accept the privacy notice to register."],
    tooManyAttempts: ["Demasiados intentos. Inténtalo más tarde.", "Troppi tentativi. Riprova più tardi.", "Too many attempts. Try again later."],
    wrongCompanyCode: ["El código de la empresa no es correcto. Pídeselo a tu supervisor.", "Il codice aziendale non è corretto. Chiedilo al tuo responsabile.", "The company code is incorrect. Ask your supervisor for the code."],
    tooManyRegistrations: ["Demasiados registros nuevos. Inténtalo más tarde.", "Troppe nuove registrazioni. Riprova più tardi.", "Too many new registrations. Try again later."],
    dailyCodeLimit: ["Hoy no se pueden enviar más códigos. Inténtalo mañana.", "Oggi non è possibile inviare altri codici. Riprova domani.", "No more codes can be sent today. Try again tomorrow."],
    registrationExpired: ["El código ha caducado. Vuelve a empezar el registro.", "Il codice è scaduto. Ricomincia la registrazione.", "The code has expired. Start your registration again."],
    wrongCode: ["Código incorrecto.", "Codice errato.", "Incorrect code."],
    noIds: ["No quedan ID disponibles. Avisa al supervisor.", "Non ci sono più ID disponibili. Avvisa il tuo responsabile.", "No employee IDs are available. Tell your supervisor."],
    tooManyCodes: ["Se han pedido demasiados códigos. Inténtalo dentro de unas horas.", "Sono stati richiesti troppi codici. Riprova tra qualche ora.", "Too many codes have been requested. Try again in a few hours."],
    noSupervisorEmail: ["No hay correo del supervisor configurado.", "L'indirizzo email del responsabile non è stato configurato.", "No supervisor email address has been set."],
    passwordTooShort: ["La contraseña debe tener al menos 8 caracteres.", "La password deve avere almeno 8 caratteri.", "The password must be at least 8 characters long."],
    wrongOrExpiredCode: ["Código incorrecto o caducado.", "Codice errato o scaduto.", "Incorrect or expired code."],
    wrongPassword: ["Contraseña incorrecta.", "Password errata.", "Incorrect password."],
    invalidMonth: ["Mes no válido.", "Mese non valido.", "Invalid month."],
    recentExport: ["Ya se envió hace un momento. Espera 1 minuto.", "Il riepilogo è stato appena inviato. Aspetta 1 minuto.", "The summary was just sent. Wait 1 minute."],
    employeeMissing: ["No se encontró al empleado. Avisa al supervisor.", "Dipendente non trovato. Avvisa il tuo responsabile.", "Employee not found. Tell your supervisor."],
    reportTooShort: ["Describe el problema con un poco más de detalle.", "Descrivi il problema con qualche dettaglio in più.", "Describe the issue in a little more detail."],
    tooManyReports: ["Se han enviado muchos reportes. Inténtalo más tarde.", "Sono state inviate troppe segnalazioni. Riprova più tardi.", "Too many reports have been sent. Try again later."],
    enterIdAndPin: ["Escribe tu ID y tu PIN.", "Inserisci il tuo ID e il tuo PIN.", "Enter your ID and PIN."],
    invalidCredentials: ["ID o PIN incorrecto.", "ID o PIN errato.", "Incorrect ID or PIN."],
    duplicateName: ["Ya hay un empleado con ese nombre. Pide tu ID al supervisor.", "C'è già un dipendente con quel nome. Chiedi il tuo ID al responsabile.", "An employee with that name already exists. Ask your supervisor for your ID."],
    duplicateEmail: ["Ese correo ya está registrado. Pide tu ID al supervisor.", "Questo indirizzo email è già registrato. Chiedi il tuo ID al responsabile.", "That email address is already registered. Ask your supervisor for your ID."],
    forbidden: ["Acción no permitida.", "Operazione non consentita.", "Action not permitted."],
    requestTooLarge: ["Petición demasiado grande.", "Richiesta troppo grande.", "The request is too large."],
    invalidRequest: ["Petición no válida.", "Richiesta non valida.", "Invalid request."],
    invalidConfig: ["Revisa la jornada diaria y el límite semanal en Config.", "Controlla l'orario giornaliero e il limite settimanale in Config.", "Check the daily working hours and weekly limit in Config."],
    missingEndpoint: ["Configura la URL /exec de Apps Script en config.js.", "Configura l'URL /exec di Apps Script in config.js.", "Set the Apps Script /exec URL in config.js."],
    offlineShort: ["Sin conexión.", "Nessuna connessione.", "You're offline."],
    serverUnavailable: ["El servidor no está disponible.", "Il server non è disponibile.", "The server is unavailable."],
    invalidResponse: ["Respuesta del servidor no válida.", "Risposta del server non valida.", "Invalid server response."],
    serverError: ["Error del servidor.", "Errore del server.", "Server error."],
    offlineStatus: ["Sin conexión. Puedes abrir Turno, pero necesitas conexión para consultar o guardar horas. Si un envío falló, comprueba la semana antes de repetirlo.", "Sei offline. Puoi aprire Turno, ma per consultare o salvare le ore serve una connessione. Se un salvataggio non è riuscito, controlla il riepilogo settimanale prima di riprovare.", "You're offline. You can open Turno, but you need an internet connection to view or save hours. If a submission failed, check your weekly records before trying again."],
    offlineSetupError: ["No se pudo preparar el acceso sin conexión. Puedes seguir usando Turno con conexión.", "Impossibile configurare l'accesso offline. Puoi continuare a usare Turno con una connessione.", "Couldn't set up offline access. You can still use Turno while online."],
    shiftLimit: ["Un turno no puede pasar de {n} horas. Revisa la entrada y la salida.", "Un turno non può superare {n} ore. Controlla l'orario di entrata e di uscita.", "A shift cannot exceed {n} hours. Check the start and finish times."],
    shiftOverlap: ["Ese horario se solapa con tu turno del {date}.", "L'orario si sovrappone al tuo turno del {date}.", "Those times overlap with your shift on {date}."],
    recentPersonalCode: ["Ya te enviamos un código. Espera {n} minutos para pedir otro.", "Ti abbiamo già inviato un codice. Aspetta {n} minuti prima di richiederne un altro.", "We've already sent you a code. Wait {n} minutes before requesting another one."],
    recentCode: ["Ya se envió un código hace poco. Espera {n} minutos.", "È già stato inviato un codice poco fa. Aspetta {n} minuti.", "A code was sent recently. Wait {n} minutes."],
    unconfirmed: ["No se pudo confirmar la respuesta del servidor. Si estabas guardando horas, comprueba la semana antes de volver a enviarlas.", "Impossibile verificare la risposta del server. Se stavi salvando le ore, controlla il riepilogo settimanale prima di inviarle di nuovo.", "We couldn't confirm the server response. If you were saving hours, check your weekly records before submitting them again."],
    restDay: ["Día de descanso", "Giorno di riposo", "Rest day"],
    workedHours: ["Horas trabajadas", "Ore lavorate", "Hours worked"],
    overnight: [" · sale al día siguiente", " · termina il giorno dopo", " · ends the next day"],
    alreadyLogged: ["Día ya registrado", "Giorno già registrato", "Day already logged"],
    noWeekRecords: ["Sin registros esta semana", "Nessuna registrazione questa settimana", "No records this week"],
    signingIn: ["Entrando…", "Accesso in corso…", "Signing in…"],
    photoSaved: ["Foto guardada.", "Foto salvata.", "Photo saved."],
    photoUnreadable: ["No se pudo leer la imagen.", "Impossibile leggere l'immagine.", "Couldn't read the image."],
    enterCompanyCode: ["Escribe el código de la empresa. Te lo da tu supervisor.", "Inserisci il codice aziendale. Chiedilo al tuo responsabile.", "Enter the company code. Ask your supervisor for it."],
    enterName: ["Escribe tu nombre y tu apellido.", "Inserisci nome e cognome.", "Enter your first and last name."],
    pinMismatch: ["Los dos PIN no coinciden.", "I due PIN non coincidono.", "The PINs don't match."],
    sendingCode: ["Enviando código…", "Invio del codice…", "Sending code…"],
    registrationCodeSent: ["Enviamos un código a {email}. Escríbelo para terminar. Si no lo ves, revisa la carpeta de spam.", "Abbiamo inviato un codice a {email}. Inseriscilo per completare la registrazione. Se non lo trovi, controlla la cartella spam.", "We sent a code to {email}. Enter it to finish registering. If you can't find it, check your spam folder."],
    confirming: ["Confirmando…", "Conferma in corso…", "Confirming…"],
    registered: ["Registro completado. Tu ID es {id}: apúntalo, lo necesitas para entrar.", "Registrazione completata. Il tuo ID è {id}. Annotalo, ti servirà per accedere.", "Registration complete. Your ID is {id}. Make a note of it, as you'll need it to sign in."],
    checking: ["Comprobando…", "Verifica in corso…", "Checking…"],
    chooseDate: ["Elige la fecha.", "Scegli la data.", "Choose a date."],
    saving: ["Guardando…", "Salvataggio in corso…", "Saving…"],
    dayOffSaved: ["Día libre registrado: {date}.", "Giorno libero registrato: {date}.", "Day off logged for {date}."],
    shiftSaved: ["Hora registrada: {date}, {schedule}.", "Turno registrato: {date}, {schedule}.", "Shift logged for {date}, {schedule}."],
    splitSchedule: ["{first} y {second}", "{first} e {second}", "{first} and {second}"],
    supervisorCodeSent: ["Enviamos un código a {email}. Escríbelo aquí abajo.", "Abbiamo inviato un codice a {email}. Inseriscilo qui sotto.", "We sent a code to {email}. Enter it below."],
    changing: ["Cambiando…", "Modifica in corso…", "Updating…"],
    passwordChanged: ["Contraseña cambiada. Ya puedes entrar con la nueva.", "Password aggiornata. Ora puoi accedere con la nuova password.", "Password updated. You can now sign in with your new password."],
    needPasswordAndMonth: ["Escribe la contraseña y elige el mes.", "Inserisci la password e scegli il mese.", "Enter your password and select a month."],
    loading: ["Cargando…", "Caricamento…", "Loading…"],
    sending: ["Enviando…", "Invio in corso…", "Sending…"],
    summarySent: ["Resumen de {month} enviado a {email}.", "Riepilogo del mese {month} inviato a {email}.", "Summary for {month} sent to {email}."],
    allEmployees: ["Todos los empleados", "Tutti i dipendenti", "All employees"],
    noMonthRecords: ["No hay registros en este mes", "Nessuna registrazione in questo mese", "No records this month"],
    publicHoliday: [" (festivo)", " (festivo)", " (public holiday)"],
    minutes: ["{n} min", "{n} min", "{n} min"],
    employeeSummary: ["Resumen del empleado", "Riepilogo del dipendente", "Employee summary"],
    recoveryEmailSent: ["Si ese correo está registrado, recibirás un mensaje con tu ID y un código. Revisa también el spam.", "Se l'indirizzo è registrato, riceverai un'email con il tuo ID e un codice. Controlla anche la cartella spam.", "If that address is registered, you'll receive an email with your ID and a code. Check your spam folder as well."],
    pinChanged: ["PIN cambiado. Tu ID es {id}.", "PIN aggiornato. Il tuo ID è {id}.", "PIN updated. Your ID is {id}."],
    pinChangedSignIn: ["PIN cambiado. Tu ID es {id}: entra con tu PIN nuevo.", "PIN aggiornato. Il tuo ID è {id}. Accedi con il nuovo PIN.", "PIN updated. Your ID is {id}. Sign in with your new PIN."],
    reportSent: ["Reporte enviado. Gracias, lo revisaremos lo antes posible.", "Segnalazione inviata. Grazie, la esamineremo appena possibile.", "Report sent. Thank you. We'll review it as soon as possible."],
    sun: ["Dom", "Dom", "Sun"],
    mon: ["Lun", "Lun", "Mon"],
    tue: ["Mar", "Mar", "Tue"],
    wed: ["Mié", "Mer", "Wed"],
    thu: ["Jue", "Gio", "Thu"],
    fri: ["Vie", "Ven", "Fri"],
    sat: ["Sáb", "Sab", "Sat"],
    pin: ["PIN", "PIN", "PIN"],
    id: ["ID", "ID", "ID"],
    countryCode: ["+39", "+39", "+39"],
    pinExample: ["••••", "••••", "••••"],
    codeExample: ["000000", "000000", "000000"],
    phoneExample: ["333 123 4567", "333 123 4567", "333 123 4567"]
  };
  var dictionaries = { es: {}, it: {}, en: {} };
  Object.keys(textos).forEach(function (key) {
    idiomas.forEach(function (lang, index) { dictionaries[lang][key] = textos[key][index]; });
  });

  var exact = {
    "No se pudo guardar la foto.": "photoSaveError",
    "Fecha no válida.": "invalidDate",
    "La fecha está fuera del periodo permitido.": "dateOutOfRange",
    "Elige la hora de entrada y de salida.": "chooseTimes",
    "Elige la pausa.": "chooseBreak",
    "Elige la entrada y la salida de la segunda parte.": "chooseSecondTimes",
    "La segunda parte debe empezar después de terminar la primera.": "secondTooEarly",
    "El turno completo no puede durar más de 24 horas.": "shiftTooLong",
    "La pausa no puede ser mayor que el turno.": "breakTooLong",
    "Ese día ya está registrado. Si hay un error, avisa al supervisor.": "alreadyLoggedError",
    "Escribe tu nombre y tu apellido (solo letras).": "invalidName",
    "Escribe un correo electrónico válido.": "invalidEmail",
    "Escribe tu teléfono sin el +39, solo números.": "invalidPhone",
    "El PIN debe tener de 4 a 8 cifras.": "invalidPin",
    "Ese PIN es demasiado fácil de adivinar. Elige otro (no 1234 ni 1111).": "weakPin",
    "Debes aceptar el aviso de privacidad para registrarte.": "privacyRequired",
    "Demasiados intentos. Inténtalo más tarde.": "tooManyAttempts",
    "El código de la empresa no es correcto. Pídeselo a tu supervisor.": "wrongCompanyCode",
    "Demasiados registros nuevos. Inténtalo más tarde.": "tooManyRegistrations",
    "Hoy no se pueden enviar más códigos. Inténtalo mañana.": "dailyCodeLimit",
    "El código ha caducado. Vuelve a empezar el registro.": "registrationExpired",
    "Código incorrecto.": "wrongCode",
    "No quedan ID disponibles. Avisa al supervisor.": "noIds",
    "Se han pedido demasiados códigos. Inténtalo dentro de unas horas.": "tooManyCodes",
    "No hay correo del supervisor configurado.": "noSupervisorEmail",
    "La contraseña debe tener al menos 8 caracteres.": "passwordTooShort",
    "Código incorrecto o caducado.": "wrongOrExpiredCode",
    "Contraseña incorrecta.": "wrongPassword",
    "Mes no válido.": "invalidMonth",
    "Ya se envió hace un momento. Espera 1 minuto.": "recentExport",
    "No se encontró al empleado. Avisa al supervisor.": "employeeMissing",
    "Describe el problema con un poco más de detalle.": "reportTooShort",
    "Se han enviado muchos reportes. Inténtalo más tarde.": "tooManyReports",
    "Escribe tu ID y tu PIN.": "enterIdAndPin",
    "ID o PIN incorrecto.": "invalidCredentials",
    "Ya hay un empleado con ese nombre. Pide tu ID al supervisor.": "duplicateName",
    "Ese correo ya está registrado. Pide tu ID al supervisor.": "duplicateEmail",
    "Acción no permitida.": "forbidden",
    "Petición demasiado grande.": "requestTooLarge",
    "Petición no válida.": "invalidRequest",
    "Revisa la jornada diaria y el límite semanal en Config.": "invalidConfig",
    "Configura la URL /exec de Apps Script en config.js.": "missingEndpoint",
    "Sin conexión.": "offlineShort",
    "El servidor no está disponible.": "serverUnavailable",
    "Respuesta del servidor no válida.": "invalidResponse",
    "Error del servidor.": "serverError",
    "Sin conexión. Puedes abrir Turno, pero necesitas conexión para consultar o guardar horas. Si un envío falló, comprueba la semana antes de repetirlo.": "offlineStatus",
    "No se pudo preparar el acceso sin conexión. Puedes seguir usando Turno con conexión.": "offlineSetupError"
  };
  var patterns = [
    [/^Un turno no puede pasar de (\d+(?:[.,]\d+)?) horas\. Revisa la entrada y la salida\.$/, "shiftLimit", "n"],
    [/^Ese horario se solapa con tu turno del (\d{1,2}\/\d{1,2}\/\d{4}|\d{4}-\d{2}-\d{2})\.$/, "shiftOverlap", "date"],
    [/^Ya te enviamos un código\. Espera (\d+) minutos para pedir otro\.$/, "recentPersonalCode", "n"],
    [/^Ya se envió un código hace poco\. Espera (\d+) minutos\.$/, "recentCode", "n"],
    [/^Enviamos un código a ([^\s@]+@[^\s@]+)\. Escríbelo aquí abajo\.$/, "supervisorCodeSent", "email"],
    [/^Enviamos un código a ([^\s@]+@[^\s@]+)\. Escríbelo para terminar\. Si no lo ves, revisa la carpeta de spam\.$/, "registrationCodeSent", "email"],
    [/^Resumen de (\d{4}-\d{2}) enviado a ([^\s@]+@[^\s@]+)\.$/, "summarySent", "month", "email"]
  ];
  var locales = { es: 'es-ES', it: 'it-IT', en: 'en-GB' };
  var storageKey = 'turno_idioma';
  function supported(lang) { return idiomas.indexOf(lang) !== -1; }
  function initialLanguage() {
    try {
      var saved = root.localStorage.getItem(storageKey);
      if (supported(saved)) return saved;
    } catch (e) {}
    var browser = ((root.navigator && root.navigator.language) || '').toLowerCase();
    return browser.indexOf('it') === 0 ? 'it' : browser.indexOf('en') === 0 ? 'en' : 'es';
  }
  var language = initialLanguage();

  function t(key, params) {
    var value = dictionaries[language][key] || key;
    return value.replace(/\{(\w+)\}/g, function (placeholder, name) {
      return params && Object.prototype.hasOwnProperty.call(params, name) ? String(params[name]) : placeholder;
    });
  }

  function serverText(text) {
    if (typeof text !== 'string' || language === 'es') return text;
    if (Object.prototype.hasOwnProperty.call(exact, text)) return t(exact[text]);
    for (var i = 0; i < patterns.length; i++) {
      var entry = patterns[i], match = entry[0].exec(text);
      if (!match) continue;
      var params = {};
      for (var j = 2; j < entry.length; j++) params[entry[j]] = match[j - 1];
      return t(entry[1], params);
    }
    return text;
  }

  function apply(doc) {
    doc.documentElement.lang = language;
    var attributes = {
      'data-i18n': 'textContent',
      'data-i18n-placeholder': 'placeholder',
      'data-i18n-aria': 'aria-label',
      'data-i18n-title': 'title'
    };
    Object.keys(attributes).forEach(function (source) {
      var target = attributes[source];
      Array.prototype.forEach.call(doc.querySelectorAll('[' + source + ']'), function (el) {
        var value = t(el.getAttribute(source));
        if (target === 'textContent') el.textContent = value;
        else el.setAttribute(target, value);
      });
    });
  }

  root.TurnoI18n = {
    dictionaries: dictionaries,
    t: t,
    serverText: serverText,
    apply: apply,
    language: function () { return language; },
    setLanguage: function (lang) {
      if (!supported(lang)) return;
      language = lang;
      try { root.localStorage.setItem(storageKey, lang); } catch (e) {}
    },
    longDate: function (date) {
      return date.toLocaleDateString(locales[language], {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
      });
    }
  };
})(window);
