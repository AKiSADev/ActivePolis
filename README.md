# ACTIVE POLIS

QUESTA APPLICAZIONE è PER LA GESTIONE DELLE SEGNALAZIONI IN UN UN'AREA PIù O MENO ESTESA.

SI è PRESO COME ESEMPIO IL COMUNE DI BARI.

## INSTALLAZIONE E TEST

per provare il prototipo è necessario avere disabilitato i cors oppure far girare l'app su un web server in locale.
Ciò è dovuto alla libreria di bootstrap Italia e alle chiamate fatte ai file di configurazione con jQuery.

Si consiglia di utilizzare l'estensione di chrome "Web Server for Chrome", avviarlo e scegliere come cartella quella del progetto che contiene il file index.html. Il sito sarà raggiungibile all'indirizzo localhost:[porta scelta].

Possono essere utilizzati altri web server come quello di python o http-server di npm.

## CREDENZIALI PER IL TEST

Il prototipo ha al suo interno controlli per riconoscere se sono loggati due tipi di utente:
    - Cittadino
    - Funzionario

Per poter testare le funzionalità di cittadino è possibile o effettuare una registrazione, oppure accedere con le credenziali
    
        Mail utente: user@user.it
        Password: user

Per poter accedere alle funzionalità di funzionario è possibile accedere con le credenziali:

        Mail utente: admin@admin.it
        Password: admin

## NOTE PER L'UTILIZZO

Il sito è responsive, quindi si potrà testare la modalità utente utilizzando gli strumenti messi a disposizione dai più comuni browser riguardo l'utilizzo in modalità mobile. Si potrà inoltre utilizzare la parte relativa al funzionario in modalità desktop (ma anche mobile)
