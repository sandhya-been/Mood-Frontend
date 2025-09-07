# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.




During the development of this React + Vite project, several challenges were encountered and addressed thoughtfully.

1. One of the primary challenges was maintaining consistent styling across multiple components while preventing CSS conflicts. To solve this, I used CSS Modules, which allow for locally scoped styles and ensure that styles from one component don’t unintentionally affect others.

2. Another consideration was avoiding code duplication, especially for layout-related elements like the sidebar. To handle this, I moved the sidebar background image setup to App.jsx, ensuring it's consistently applied across all pages without repeating code in each individual component.

3. For responsive design, I implemented media queries throughout the project to ensure a smooth experience on different screen sizes and devices. Smooth hover effects and basic client-side validations were also added to improve user interaction and accessibility.

4. I chose a modular folder structure with dedicated folders like routes and moodCheckIn to keep the code organized, scalable, and easy to understand for future developers.

5. Key libraries and packages include:

    -> react and react-dom for building the UI

    -> react-router-dom for routing

    ->react-icons for scalable icons