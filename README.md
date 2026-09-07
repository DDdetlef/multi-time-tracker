# ⏱️ Multi Time Tracker

<img width="1999" height="1175" alt="image" src="https://github.com/user-attachments/assets/3833c1e4-4af6-4964-8108-4895b220cfdd" />

Ein eleganter, browserbasierter Timer zur Überwachung der Redezeit mehrerer Speaker gleichzeitig. Entwickelt für Podiumsdiskussionen, Panels, Debatten und Live-Events – mit dynamischem Setup, visuellen Warnungen und professionellem Branding.

---

## ✨ Features

| Kategorie | Funktion |
|-----------|----------|
| **Dynamisches Setup** | • Veranstaltungstitel<br>• Sprecher-Anzahl (1–6)<br>• Individuelle oder einheitliche Zeit |
| **Timer-Funktionen** | • Start/Stop/Reset pro Sprecher<br>• Letzte Minute (gelborange #faec04)<br>• Überschreitung mit Minus (rotorange #bb3f17) |
| **Design** | • 2-Spalten-Grid (max. 2 Timer pro Zeile)<br>• Weiße Linien mit abgerundeten Ecken<br>• Zentrierte Sprecher-Namen (24px)<br>• Zentrierte Buttons |
| **Branding** | • Header-Logo links<br>• Info-Block mit Logo<br>• Responsive für alle Geräte |
| **Test-Modus** | • `+1 Min` / `-1 Min` für schnelle Tests<br>• Reset-Funktion pro Timer |

---

## 🚀 Schnellstart

### **Voraussetzungen**
- Moderner Browser (Chrome, Firefox, Safari, Edge)
- Keine Installation nötig – läuft direkt im Browser

### **1. Dateien herunterladen**
```bash
# Projekt klonen
git clone https://github.com/dein-username/multi-time-tracker.git
cd multi-time-tracker
```

### **2. Logos vorbereiten**
1. Erstelle den Ordner `assets/`
2. Füge deine Logos hinzu:
   - `logo_header.png` oder `logo_header.jpg` (Header-Logo)
   - `logo_infoblock.png` oder `logo_infoblock.jpg` (Info-Block-Logo)

### **3. Starten**
```bash
# Einfach index.html im Browser öffnen
open index.html
```

### **4. Für WLAN-Streaming (optional)**
```bash
# Python HTTP Server
python -m http.server 8000

# Oder Node.js Server
npm install express
node server.js
```

---

## 📋 Verwendung

### **Setup-Phase**
1. **Veranstaltungstitel** eingeben (z.B. "Hofgespräch im Landgasthaus")
2. **Anzahl der Sprecher** wählen (1–6)
3. **Zeitkonfiguration** wählen:
   - *Alle gleich*: Einheitliche Zeit für alle Sprecher
   - *Individuell*: Zeit pro Sprecher (kann später ergänzt werden)
4. **Sprecher-Namen** eingeben
5. **Standardzeit** festlegen (Standard: 15 Minuten)
6. Auf **"Timer Generieren"** klicken

<img width="680" height="694" alt="image" src="https://github.com/user-attachments/assets/558f4716-5b44-44d0-ae5f-17685e9c74ac" />


### **Timer-Phase**
| Aktion | Beschreibung |
|--------|--------------|
| **Start** | Timer beginnt zu laufen |
| **Stop** | Timer pausiert |
| **+1 Min** | Fügt 1 Minute hinzu (Test-Modus) |
| **-1 Min** | Entfernt 1 Minute (Test-Modus) |
| **Reset** | Setzt Timer auf 15:00 zurück |

### **Farbliche Warnungen**
| Phase | Anzeige | Farbe | Hex-Code |
|-------|---------|-------|----------|
| **Normale Zeit** | `15:00` – `01:00` | Weiß | `#ffffff` |
| **Letzte Minute** | `00:59` – `00:00` | Gelborange | `#faec04` |
| **Überzogen** | `− 00:01` – `− ∞` | Rotorange | `#bb3f17` |

---

## 📁 Projekt-Struktur

```
multi-time-tracker/
├── index.html              # Haupt-HTML mit Setup + Timer
├── css/
│   └── styles.css          # Alle Styles (Setup + Timer)
├── js/
│   ├── setup.js            # Setup-Logik (Eingabe, Generierung)
│   ├── timer.js            # Timer-Logik (Start, Stop, Anzeige)
│   └── app.js              # Haupt-App-Initialisierung
├── assets/
│   ├── logo_header.png     # Header-Logo (PNG oder JPG)
│   ├── logo_infoblock.png  # Info-Block-Logo (PNG oder JPG)
│   └── preview.png         # Screenshot für README
├── README.md               # Projekt-Dokumentation
├── package.json            # Dependencies (für Node.js Server)
├── server.js               # Optional: Node.js Server für WLAN
└── .gitignore              # Git Ignore Datei
```

---

## 🖼️ Logo-Platzierung

### **Header-Logo**
- **Position**: Links oben
- **Größe**: `100px` (Desktop), `80px` (Mobile)
- **Dateiname**: `logo_header.png` oder `logo_header.jpg`
- **Empfohlenes Format**: PNG mit transparentem Hintergrund

### **Info-Block-Logo**
- **Position**: Unten im Info-Block
- **Größe**: `150px` (Desktop), `120px` (Mobile)
- **Dateiname**: `logo_infoblock.png` oder `logo_infoblock.jpg`
- **Empfohlenes Format**: PNG mit transparentem Hintergrund

### **Beispiel-Logos**
```
assets/
├── logo_header.png         # Kleines, klares Logo für Header
└── logo_infoblock.png      # Etwas größeres Logo für Info-Block
```

---

## 🛠️ Technische Details

| Technologie | Version |
|-------------|---------|
| HTML | 5 |
| CSS | 3 (Grid, Flexbox, Media Queries) |
| JavaScript | ES6+ |
| Browser | Chrome, Firefox, Safari, Edge (2020+) |

### **Responsive-Design**
- **Desktop**: 2 Spalten (max. 2 Timer pro Zeile)
- **Tablet**: 2 Spalten
- **Mobile**: 1 Spalte

### **Performance**
- Keine externen Abhängigkeiten
- CSS/JS können vom Browser gecacht werden
- Optimiert für schnelle Ladezeiten

---

## 🌐 WLAN-Streaming für Publikum

### **Methode 1: Python HTTP Server**
```bash
python -m http.server 8000
```
- **Zugriff**: `http://DEINE-IP:8000`
- **IP-Adresse finden**:
  - Windows: `ipconfig`
  - Mac/Linux: `ifconfig`

### **Methode 2: Node.js Server**
```bash
npm install express
node server.js
```
- **Zugriff**: `http://DEINE-IP:8000`

### **QR-Code für einfachen Zugriff**
Generiere einen QR-Code mit der Server-URL:
```
http://192.168.1.100:8000
```

---

## 🎯 Use Cases

| Event-Typ | Anwendung |
|-----------|-----------|
| 🏛️ **Podiumsdiskussionen** | Politische Events, Debatten |
| 🎤 **Panels & Konferenzen** | Mehrere Speaker im Wechsel |
| ⚖️ **Debatten & Wettbewerbe** | Zeitlimits pro Teilnehmer |
| 🎓 **Vorträge & Präsentationen** | Studenten, Forscher |
| 📺 **Live-Events** | TV, Streaming, Aufzeichnungen |

---

## 🧪 Test-Modus

### **Schnelltest für Farbänderungen**
1. Starte einen Timer
2. Klicke auf **"-1 Min"** bis `00:59` erreicht ist
3. Warte bis `00:00` → Farbe wechselt zu **gelborange**
4. Klicke weiter auf **"-1 Min"** → Farbe wechselt zu **rotorange** mit Minuszeichen

### **Test-Buttons**
- `+1 Min` – Fügt eine Minute hinzu
- `-1 Min` – Entfernt eine Minute
- `Reset` – Setzt Timer auf 15:00 zurück

---

## 🤝 Contributing

Beiträge sind willkommen! Bitte beachte:

1. Fork das Repository
2. Erstelle einen Feature-Branch (`git checkout -b feature/neue-funktion`)
3. Commit deine Änderungen (`git commit -m 'Neue Funktion hinzugefügt'`)
4. Push zum Branch (`git push origin feature/neue-funktion`)
5. Öffne einen Pull Request

---

## 📄 Lizenz

Dieses Projekt ist unter der **MIT-Lizenz** lizenziert. Siehe [LICENSE](./LICENSE) für Details.

---

## 👨‍💻 Autor

**Dein Name**  
[GitHub-Profil](https://github.com/dein-username)  
[Website](https://deine-website.de)

---

## 🙏 Danksagungen

- Inspiriert von Podiumsdiskussionen der **Stiftung Domäne Dahlem**
- Design orientiert an modernen Event-Timer-Displays

---

## 📞 Support

Bei Fragen oder Problemen:
- 📧 Email: deine-email@beispiel.de
- 💬 Issues: [GitHub Issues](https://github.com/dein-username/multi-time-tracker/issues)

---

<div align="center">

**Made with ❤️ for better event time management**

[⬆ Nach oben](#-multi-time-tracker)

</div>

---



---

Möchtest du, dass ich dir **ein ZIP-Paket mit dieser README** und der kompletten Projektstruktur erstelle? 😊
