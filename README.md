# QuestLog Client

> **Turn Your Life into an Epic RPG.**

QuestLog is a gamified task management application designed to make productivity addictive. By treating your daily tasks as "quests" and your personal growth as "leveling up," QuestLog helps you stay motivated and organized.

This repository contains the frontend client built with **Next.js 16**, **React 19**, and **Tailwind CSS 4**.

## Tech Stack

-   **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
-   **Core:** [React 19](https://react.dev/)
-   **Language:** [TypeScript](https://www.typescriptlang.org/)
-   **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
-   **Animations:** [Framer Motion](https://www.framer.com/motion/)
-   **Icons:** [Lucide React](https://lucide.dev/)
-   **HTTP Client:** [Axios](https://axios-http.com/)
-   **Utilities:** `lodash`, `clsx`, `tailwind-merge`

## Features

* **Gamified Dashboard:** View your stats, level, and XP progress at a glance.
* **Quest Management:** Create, edit, and complete tasks (Quests) to earn rewards.
* **Responsive Design:** Fully optimized for desktop and mobile play styles.
* **Modern UI:** Built with the latest Tailwind CSS v4 and smooth Framer Motion animations.

## Getting Started

### Prerequisites

Make sure you have **Node.js** (version 18+ or 20+ recommended) installed on your machine.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/QuantGit43/questlog-client.git](https://github.com/QuantGit43/questlog-client.git)
    cd questlog-client
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

3.  **Set up Environment Variables:**
    Create a `.env.local` file in the root directory and add your API URL (if your backend is running):
    ```env
    NEXT_PUBLIC_API_URL=http://localhost:5000/api
    ```

### Running the App

Run the development server:

```bash
npm run dev
