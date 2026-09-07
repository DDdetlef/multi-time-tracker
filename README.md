# Multi Time Tracker

A lightweight, browser-based timer for tracking the speaking time of multiple speakers. It is designed for panel discussions, debates, presentations, conferences, and other live events.

The application runs locally in a modern browser and does not require a framework, build process, database, or internet connection.

## Features

### Setup

- Custom event title
- One to six speakers
- Custom name for each speaker
- Shared speaking time from 1 to 120 minutes
- Choice between **Live mode** and **Test mode**
- Separate display cards and central control panel

### Live mode

Live mode separates the readable speaker display from the controls. Each display card contains:

- Speaker name
- Remaining or exceeded speaking time
- Clear timer state

The central control panel provides one named Start/Stop button per speaker. Test controls are not created.

### Test mode

Test mode adds these controls to the matching speaker's control row:

- `+1 Min`
- `-1 Min`
- `Reset`

This mode is intended for testing the warning states and checking the application before an event.

### Timer states

| State | Display |
|---|---|---|
| Bereit | Timer has not been started or was reset |
| Läuft | Timer is active |
| Pausiert | Started timer is stopped outside the final minute |
| Letzte Minute | Remaining time from `00:59` through `00:00` |
| Zeit überschritten | Negative elapsed time |

The timer continues below zero and displays overtime with a minus sign. Status text and the card border supplement color indicators.

### Global control

The control panel contains **Alle stoppen** in a separate lower area. It pauses only running timers and preserves each timer's exact millisecond remaining time.

## Requirements

- A current version of Chrome, Edge, Firefox, or Safari
- JavaScript enabled
- No installation required

## Project structure

```text
multi-time-tracker/
├── index.html
├── css/
│   └── styles.css
├── js/
│   ├── setup.js
│   ├── timer.js
│   └── app.js
└── assets/
    ├── logo_header_left.png
    └── logo_header_right.jpg
```

## Installation

1. Download or clone the project.
2. Keep the directory structure unchanged.
3. Keep the two header logo files in the `assets` directory if they are used.
4. Open `index.html` in a modern browser.

No package installation is required.

## Automated tests

If Node.js is available, run the automated timer boundary and control-state tests with:

```bash
npm test
```

## Usage

### 1. Configure the event

On the Setup screen:

1. Enter an event title.
2. Select the number of speakers.
3. Set the speaking time in minutes.
4. Select a mode:
   - **Live** for normal event operation
   - **Test** for testing with additional controls
5. Enter the speaker names.
6. Select **Generate timers**.

If a speaker name is left empty, the application assigns a default name automatically.

### 2. Run a timer

Use the named button in the central control panel to begin a timer. Its label changes from `[Name] starten` to `[Name] stoppen` while running.

Select **Stop** to pause the timer. Selecting **Start** again continues from the paused value.

Multiple timers can run independently at the same time.

### 3. Use Test mode

In Test mode:

- Select `-1 Min` to approach the final-minute warning or move into overtime.
- Select `+1 Min` to add one minute.
- Select `Reset` to stop the selected timer and restore its configured starting time.

Time adjustments also work while a timer is running.

### 4. Return to Setup

Select **Back to Setup** to return to the configuration screen. Running timers are stopped before the view changes.

## Local network use

The project can be served on a local network with a simple HTTP server.

### Python

Run this command from the project directory:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

Other devices on the same network can use the computer's local IP address instead of `localhost`.

> **Important:** A static HTTP server only distributes the application files. Each browser runs an independent timer session. Timer changes are not synchronized between devices.

## Technical notes

- HTML5, CSS, and plain JavaScript
- No external runtime dependencies
- No build process
- Responsive two-column layout on larger screens
- Single-column layout on smaller screens
- Timer calculations use timestamps to reduce drift caused by delayed browser intervals
- User-entered names are inserted as text rather than executable HTML
- All controls are keyboard accessible; timer-state changes are announced without announcing every second

## Limitations

- All speakers currently use the same configured starting time.
- Timer sessions are not synchronized across devices.
- Setup values such as event title and speaker names are not permanently stored.
- The application does not create reports or export speaking-time data.

## Troubleshooting

### The page has no styling

Confirm that the stylesheet is located at:

```text
css/styles.css
```

### The buttons do not work

Confirm that all JavaScript files exist at:

```text
js/setup.js
js/timer.js
js/app.js
```

Also confirm that JavaScript is enabled in the browser.

### A header logo is missing

Confirm that the expected image file exists in the `assets` directory and that its filename matches exactly, including uppercase and lowercase letters.

## Development priorities

The project is intentionally kept small. Future changes should focus on reliability and ease of use rather than adding unnecessary infrastructure.

Potential future improvements include:

- Optional full-screen mode
- Persistent event title and speaker names
- A separate synchronized audience display, only if multi-device synchronization becomes necessary

## License

Add the project's license file and license information here. If the project uses the MIT License, include a `LICENSE` file in the project root.
