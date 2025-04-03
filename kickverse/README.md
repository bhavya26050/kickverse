# KickVerse

KickVerse is a custom sneaker store application that allows users to design and shop for custom sneakers with 3D visualization. This project is built using Next.js and TypeScript, providing a modern and efficient web experience.

## Project Structure

The project is organized as follows:

```
kickverse
├── app
│   ├── globals.css          # Global CSS styles for the application
│   ├── layout.tsx           # Root layout of the application
│   └── page.tsx             # Main page of the application
├── components
│   ├── Footer.tsx           # Footer component
│   ├── Navbar.tsx           # Navbar component
│   └── theme-provider.tsx    # ThemeProvider component for managing themes
├── context
│   └── CartContext.tsx      # Context for managing shopping cart state
├── package.json              # npm configuration file
├── tsconfig.json             # TypeScript configuration file
└── README.md                 # Documentation for the project
```

## Features

- **Custom Sneaker Design**: Users can design their own sneakers with various customization options.
- **3D Visualization**: View the sneakers in 3D to get a better sense of the design.
- **Responsive Design**: The application is designed to work on various screen sizes.
- **Dark Theme Support**: The application supports a dark theme for better user experience.

## Getting Started

To get started with the KickVerse application, follow these steps:

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```
   cd kickverse
   ```

3. Install the dependencies:
   ```
   npm install
   ```

4. Run the development server:
   ```
   npm run dev
   ```

5. Open your browser and go to `http://localhost:3000` to view the application.

## Contributing

Contributions are welcome! If you have suggestions for improvements or new features, feel free to open an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.