# Tourly - Travel Customization Platform

A modern travel platform built with Next.js 15, TypeScript, and Tailwind CSS that allows users to explore destinations and customize their travel experiences.

## Features

### 1. Home Page (/)
- Interactive carousel banner showcasing destinations
- Centralized search bar for quick destination access
- Popular destinations section with dynamic card layout
- Feature highlights and call-to-action sections

### 2. Customize Page (/customize)
Step-by-step travel customization process:
1. **Destination Selection**
   - Searchable list of popular destinations
   - Real-time filtering
   - Visual destination cards

2. **Duration Selection**
   - Flexible trip duration options (3-14 days)
   - Interactive selection interface

3. **Traveler Type**
   - Solo traveler
   - Couple
   - Family
   - Group

4. **Room Configuration**
   - Multiple room support
   - Adult and children occupancy settings
   - Dynamic room addition/removal

5. **Confirmation**
   - Trip summary
   - Booking details overview

### 3. Destination Pages (/destination/[handle])
- Comprehensive trip listings
- Detailed pricing information
- Duration and amenity displays
- High-quality destination images
- Fixed "Talk to Expert" support button

## Technology Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI
- **State Management**: React Hooks
- **Image Optimization**: Next.js Image Component
- **Icons**: Lucide React
- **API Integration**: REST APIs

## API Endpoints

The application integrates with the following API endpoints:
- Banners: \`https://json-data-1wm2.onrender.com/banners\`
- Featured Destinations: \`https://json-data-1wm2.onrender.com/featured-destination\`
- Destination Trips: \`https://json-data-1wm2.onrender.com/destination/[handle]\`

## Getting Started

1. **Clone the repository**
   \`\`\`bash
   git clone [repository-url]
   cd tourly
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Run the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

4. **Build for production**
   \`\`\`bash
   npm run build
   npm start
   \`\`\`

## Project Structure

\`\`\`
tourly/
├── app/
│   ├── components/
│   │   ├── ui/          # Reusable UI components
│   │   ├── home/        # Home page components
│   │   ├── customize/   # Customization flow components
│   │   └── destination/ # Destination page components
│   ├── customize/       # Customize page
│   ├── destination/     # Dynamic destination pages
│   └── page.tsx         # Home page
├── lib/
│   └── utils.ts         # Utility functions
├── public/
│   └── images/          # Static images
└── styles/
    └── globals.css      # Global styles
\`\`\`

## Features in Detail

### Destination Images
- High-quality images from Unsplash
- Optimized loading with Next.js Image component
- Fallback images for each destination
- Responsive image sizing
- Progressive loading

### Customization Flow
- Progress indicator
- Back navigation
- Form validation
- Responsive design
- Mobile-optimized interface

### Trip Cards
- Dynamic amenity icons
- Price formatting
- Responsive grid layout
- Image error handling
- Loading states

## Contributing

1. Fork the repository
2. Create your feature branch (\`git checkout -b feature/AmazingFeature\`)
3. Commit your changes (\`git commit -m 'Add some AmazingFeature'\`)
4. Push to the branch (\`git push origin feature/AmazingFeature\`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Images provided by [Unsplash](https://unsplash.com)
- UI Components by [Shadcn UI](https://ui.shadcn.com)
- Icons by [Lucide](https://lucide.dev)
