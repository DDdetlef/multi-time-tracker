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
- Optional event information text
- Optional event logo
- Automatic local storage of the information text, logo, and info-box visibility

### Live mode

Live mode provides a clean interface for use during an event. Each speaker card contains:

- Speaker name
- Remaining or exceeded speaking time
- Start and Stop button

The additional test controls are not displayed.

### Test mode

Test mode includes all Live mode functions as well as:

- `+1 Min`
- `-1 Min`
- `Reset`

This mode is intended for testing the warning states and checking the application before an event.

### Timer states

| State | Display | Color |
|---|---|---|
| Normal | Remaining time above one minute | White |
| Final minute | `00:59` down to `00:00` | Yellow |
| Overtime | Negative elapsed time | Red-orange |

The timer continues below zero and displays overtime with a minus sign.

### Event information and logo

The event information section is configured only on the Setup screen.

- The information text is saved automatically while typing.
- The info box can be shown or hidden from the Setup screen.
- Its visibility is synchronized with the Timer screen.
- The Timer screen does not contain editing or visibility controls.
- A PNG or JPEG logo can be selected on the Setup screen.
- The selected logo is shown on both screens.
- The logo can be removed completely from the Setup screen.
- Uploaded logos are limited to 1 MB.

The settings are stored in the browser using `localStorage`. They remain available after reloading the page in the same browser, unless the browser storage is cleared.

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
    ├── logo_header_right.png
    └── logo_infoblock.png
```

## Installation

1. Download or clone the project.
2. Keep the directory structure unchanged.
3. Add the three standard logo files to the `assets` directory if they are not already included.
4. Open `index.html` in a modern browser.

No package installation is required.

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
6. Optionally edit the event information.
7. Optionally select or remove an event logo.
8. Select **Generate timers**.

If a speaker name is left empty, the application assigns a default name automatically.

### 2. Run a timer

Select **Start** in a speaker card to begin its timer. The button changes to **Stop** while the timer is running.

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

## Standard logos

The application expects these optional files:

```text
assets/logo_header_left.png
assets/logo_header_right.png
assets/logo_infoblock.png
```

Recommended properties:

- PNG with a transparent background
- Clear design with good contrast
- Header logos sized for compact display
- Info logo suitable for a width of approximately 150 pixels

If no custom event logo is stored, `logo_infoblock.png` is used as the default. The application remains usable if a logo file is missing, but the corresponding standard logo will not be displayed correctly.

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
- User-entered names and information text are inserted as text rather than executable HTML

## Browser storage

The following values may be stored locally:

- Event information text
- Selected event logo
- Logo removal state
- Info-box visibility

The data is stored only in the current browser profile. It is not uploaded or shared automatically.

To remove the stored values, clear the website data for the page in the browser. Removing the event logo with the Setup control also removes its saved image data.

## Limitations

- All speakers currently use the same configured starting time.
- Timer sessions are not synchronized across devices.
- Setup values such as event title and speaker names are not permanently stored.
- Uploaded logos are stored in the browser and are therefore subject to browser storage limits.
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

### A standard logo is missing

Confirm that the expected image file exists in the `assets` directory and that its filename matches exactly, including uppercase and lowercase letters.

### A selected logo cannot be saved

Use a PNG or JPEG file no larger than 1 MB. Browser privacy settings or disabled local storage may also prevent the logo from being retained.

### The stored settings should be reset

Clear the page's website data or local storage in the browser settings.

## Development priorities

The project is intentionally kept small. Future changes should focus on reliability and ease of use rather than adding unnecessary infrastructure.

Potential future improvements include:

- Optional text labels for warning and overtime states
- Optional full-screen mode
- Persistent event title and speaker names
- A separate synchronized audience display, only if multi-device synchronization becomes necessary

## License

Add the project's license file and license information here. If the project uses the MIT License, include a `LICENSE` file in the project root.
