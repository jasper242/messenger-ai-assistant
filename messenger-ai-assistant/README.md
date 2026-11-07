# Messenger AI Assistant

A web app that drafts replies to messages using the OpenAI API. It does not connect to your personal Facebook inbox and does not send messages automatically.

## Setup (Windows / VS Code)
1. Extract this ZIP and open the `messenger-ai-assistant` folder in VS Code.
2. Install Node.js 20 or newer.
3. In the project root terminal, run `npm install`.
4. Run `npm run install:all`.
5. Copy `server/.env.example` to `server/.env`.
6. Put your OpenAI API key in `server/.env`.
7. Run `npm run dev` and open http://localhost:5173.

Never commit `server/.env` or share your API key.

## Note
Meta's official Messenger Platform is for Facebook Pages, not automating a personal Facebook profile inbox. This project is a manual reply-drafting assistant. Review and send replies yourself.
