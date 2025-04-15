# BookCircle 📚

A modern social reading platform built with Angular 20, where book lovers can discover, track, and review their favorite books. Connect with fellow readers and build your personal reading community.

![BookCircle](https://img.shields.io/badge/Angular-20-red?style=for-the-badge&logo=angular)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3-38B2AC?style=for-the-badge&logo=tailwind-css)

## ✨ Features

- **📖 Personal Library Management** - Organize books into "Want to Read", "Currently Reading", and "Completed" lists
- **⭐ Reviews & Ratings** - Share detailed reviews and star ratings to help other readers
- **🔍 Smart Discovery** - Search and filter books by title, author, genre, and ratings
- **👥 Social Features** - Connect with other readers, like reviews, and build your reading community
- **📊 Reading Statistics** - Track your reading progress with detailed analytics
- **📱 Responsive Design** - Beautiful, modern UI that works on all devices
- **⚡ Fast & Modern** - Built with Angular 20 and optimized for performance

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm (v8 or higher)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/dina0elsergani/bookcircle-angular.git
   cd bookcircle-angular
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:4200`

### Demo Account

For testing purposes, you can use the demo account:
- **Email:** `demo@bookcircle.com`
- **Password:** `demo123`

## 🏗️ Project Structure

```
src/
├── app/
│   ├── core/                 # Core services, models, and guards
│   │   ├── services/         # API services and business logic
│   │   ├── models/          # TypeScript interfaces
│   │   └── guards/          # Route guards
│   ├── features/            # Feature modules
│   │   ├── auth/           # Authentication components
│   │   ├── books/          # Book-related components
│   │   ├── dashboard/      # Dashboard component
│   │   ├── library/        # Personal library management
│   │   ├── profile/        # User profile management
│   │   └── reviews/        # Review system
│   ├── shared/             # Shared components and utilities
│   │   └── components/     # Reusable UI components
│   └── layout/             # Layout components (header, footer)
├── assets/                 # Static assets
└── global_styles.css       # Global styles and Tailwind configuration
```

## 🛠️ Technology Stack

- **Frontend Framework:** Angular 20
- **Language:** TypeScript 5.8
- **Styling:** Tailwind CSS 3.3
- **Icons:** Lucide Angular
- **State Management:** RxJS Observables
- **Build Tool:** Angular CLI

## 📱 Available Scripts

- `npm start` - Start development server
- `npm run dev` - Alias for start command
- `npm run build` - Build for production
- `npm run ng` - Run Angular CLI commands

## 🎨 UI Components

The application includes several reusable components:

- **BookCard** - Display book information in a card format
- **StarRating** - Interactive star rating component
- **LoadingSpinner** - Loading indicator with customizable messages
- **Header** - Navigation header with user menu

## 🔧 Configuration

### Environment Setup

Currently, the application uses mock data for demonstration purposes. To integrate with a real backend:

1. Create environment files in `src/environments/`
2. Update service files to use real API endpoints
3. Configure authentication tokens and API keys

### Tailwind CSS

The project uses Tailwind CSS for styling. Custom styles are defined in `src/global_styles.css`:

- Custom color palette (primary, secondary, accent)
- Component classes (buttons, cards, inputs)
- Custom animations and utilities

## 🚧 Current Status

**⚠️ Demo/Prototype Version**

This is currently a frontend demo with the following limitations:

- Uses mock data instead of real APIs
- No persistent data storage
- Limited to demo user account
- No real authentication system

## 🔮 Roadmap

- [ ] Backend API integration
- [ ] Real authentication system
- [ ] Database integration
- [ ] User registration and profiles
- [ ] Book recommendations
- [ ] Reading progress tracking
- [ ] Social features (following, notifications)
- [ ] Mobile app
- [ ] Advanced search and filters
- [ ] Book clubs and discussions

## 🤝 Contributing

We welcome contributions! Please read our contributing guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow Angular style guide
- Use TypeScript strict mode
- Write meaningful commit messages
- Test your changes thoroughly
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Angular](https://angular.io/) - The web framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Lucide](https://lucide.dev/) - Beautiful icons
- [Unsplash](https://unsplash.com/) - Stock photos for book covers

## 📞 Support

If you have any questions or need help:

- Open an issue on GitHub
- Check the documentation
- Join our community discussions

---

**Made with ❤️ for book lovers everywhere** 