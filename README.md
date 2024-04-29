# Task time tracker

| This project is a task time tracker. ||
|----------------------------------------------------------------|------------------------|
| <div style="text-align: left;"> 🔹 Take time from the duration of the task.<br /> 🔹 Stop time for a break and continue. <br /> 🔹 Stop time for a break and continue. <br /> 🔹 The app calculates the elapsed time to complete the task.<br /> 🔹 View past task times. </div> |![kuva](https://github.com/Rassemus/TaskTracker/assets/58720934/2fbd03c8-f379-4d49-bccc-d8a46c054696)|

## Getting Started

> [!IMPORTANT]
> At the first startup, the internet connection must be on.
> 
> The service worker caches the data for offline access.

Locate root folder via terminal.

`npm start`

Open [http://localhost:3000](http://localhost:3000) to view project in your browser.

Start the JSON-server in another terminal.

The JSON-server uses port 3000 by default, let's change it to 8000 because 3000 is reserved.

`json-server --watch data/db.json --port 8000`

The db.json file is located in a folder called data.

> [!TIP]
> You can also try the app without a JSON-server or offline.


