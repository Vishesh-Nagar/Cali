# Cali

## Summary of Features

Cali is a dynamic event calendar that allows users to manage their daily events seamlessly. Key features include:

1. **Monthly Calendar View**: Display a calendar with the current month, showing days and navigation to previous and next months.

2. **Add Events**:
   - Add events to a specific day via a form.
   - Specify event details such as title, type (work, personal, others), start time, end time, and description.
   - Prevent duplicate event entries on the same day with the same title.

3. **View Events**:
   - View the total number of events for each day.
   - Filter and display events for the selected day.

4. **Delete Events**: Remove events from the calendar with instant updates.

5. **Edit Events**: Edit created events with instant updates.

6. **Persistent Data**: Events are saved in the browser's localStorage, ensuring they persist across sessions.

7. **Export Data**: Export the data of Events for any particular month.

8. **Dynamic Styling**:
   - Highlight the current day.
   - Differentiate days with and without events.

## Instructions to Run the App Locally

### Prerequisites

- Node.js installed on your machine.
- A package manager such as `npm` or `yarn`.

### Steps to Run

1. **Clone the Repository**:

   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```

2. **Install Dependencies**:

    ```bash
    npm install
    # or
    yarn install
    ```

3. **Start the Development Server**:

    ```bash
    npm run dev
    # or
    yarn dev
    ```

4. **Open the App in Your Browser: Once the server is running, open your browser and navigate to**:

    ```bash
    http://localhost:3000
    ```

5. **Use the Application**:

- Navigate through the months.
- Add, view, and delete events.

6. **Optional: Build for Production: To build the application for production:**

    ```bash
    npm run build
    # or
    yarn build
    ```

    **Serve the built application**:

    ```bash
    npm start
    or
    yarn start
    ```

**Notes**

- The application uses localStorage for event data. Clearing browser storage will remove all saved events.

- Ensure the browser supports localStorage and modern JavaScript features.

## Deploy on Vercel

The deployed version of this application is on [Cali](https://cali-rosy.vercel.app/).
