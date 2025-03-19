# Discord Bot Project

This project is a Discord bot that monitors messages in a specific channel, extracts emails from user messages, checks the emails against a Google Sheets list, assigns a specific role if the email is valid, and sends an error message if the email is invalid.

## Features

- Monitors messages in a designated Discord channel.
- Extracts email addresses from user messages.
- Validates email formats.
- Checks extracted emails against a list stored in Google Sheets.
- Assigns roles based on email validation results.
- Sends error messages for invalid emails.

## Setup Instructions

1. **Clone the Repository**
   Clone this repository to your local machine or Replit environment.

   ```
   git clone <repository-url>
   ```

2. **Install Dependencies**
   Navigate to the project directory and install the required dependencies using npm:

   ```
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root directory and add your Discord bot token and Google Sheets credentials:

   ```
   DISCORD_TOKEN=your_discord_token
   GOOGLE_SHEET_ID=your_google_sheet_id
   GOOGLE_SHEET_RANGE=your_google_sheet_range
   ```

4. **Run the Bot**
   Start the bot by running the following command:

   ```
   node src/bot.js
   ```

## Usage Guidelines

- Ensure that the bot has the necessary permissions to read messages and manage roles in the Discord server.
- The bot will automatically monitor messages in the specified channel and respond based on the email validation logic.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.