# FinFlow - AI-Powered Personal Finance Dashboard

FinFlow is a comprehensive personal finance management application built with Next.js, featuring AI-powered insights and modern UI components.

## Features

### 🏠 **Dashboard**
- Overview of financial health with key metrics
- Interactive charts showing income vs expenses
- Net worth tracking with trend indicators
- Monthly savings rate analysis

### 💳 **Transactions**
- Complete transaction history with filtering
- Categorized spending breakdown
- Drag-and-drop transaction management
- Editable transaction details

### 📊 **Analytics**
- Deep financial insights and trends
- Expense category breakdowns with pie charts
- Monthly financial trend analysis
- Interactive data visualization

### 💰 **Investments**
- Portfolio tracking and performance monitoring
- Asset allocation analysis
- Investment holdings with real-time changes
- YTD returns and contribution tracking

### 🎯 **Goals**
- Financial goal setting and tracking
- Progress visualization with completion percentages
- Priority-based goal management
- Deadline tracking and alerts

### 🏦 **Accounts**
- Multi-account management (checking, savings, credit cards)
- Real-time balance tracking
- Account categorization and filtering
- Net worth calculation

### 📋 **Budgets**
- Category-based budget management
- Spending vs budget tracking
- Over-budget alerts and notifications
- Monthly budget performance analysis

### 📈 **Reports**
- Comprehensive financial reporting
- Custom report generation
- Scheduled report automation
- Export capabilities for tax preparation

### ⚙️ **Settings**
- Profile and preference management
- Notification settings
- Security and privacy controls
- Billing and subscription management

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **UI Components**: Radix UI primitives with custom styling
- **Styling**: Tailwind CSS with custom design system
- **Charts**: Recharts for data visualization
- **Icons**: Tabler Icons
- **Animations**: Framer Motion
- **Type Safety**: TypeScript throughout

## Getting Started

1. **Install dependencies**:
```bash
npm install
```

2. **Run the development server**:
```bash
npm run dev
```

3. **Open your browser**:
Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── dashboard/         # Main dashboard page
│   ├── transactions/      # Transaction management
│   ├── analytics/         # Financial analytics
│   ├── investments/       # Investment tracking
│   ├── goals/            # Financial goals
│   ├── accounts/         # Account management
│   ├── budgets/          # Budget tracking
│   ├── reports/          # Financial reports
│   └── settings/         # User settings
├── components/           # Reusable UI components
│   ├── ui/              # Base UI components
│   └── ...              # Feature-specific components
└── lib/                 # Utility functions
```

## Key Features

### Modern UI/UX
- Responsive design that works on all devices
- Dark mode support with system preference detection
- Smooth animations and transitions
- Accessible components following WCAG guidelines

### Data Visualization
- Interactive charts and graphs
- Real-time data updates
- Multiple chart types (line, bar, pie, area)
- Customizable date ranges and filters

### Financial Management
- Comprehensive transaction tracking
- Multi-currency support
- Budget management with alerts
- Goal tracking with progress indicators

### Security & Privacy
- Secure authentication system
- Data encryption and privacy controls
- Session management
- Two-factor authentication support

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Component Architecture

The application uses a modular component architecture with:
- Reusable UI components in `/components/ui/`
- Feature-specific components for each page
- Consistent design system with Tailwind CSS
- Type-safe props with TypeScript

## Deployment

The application is optimized for deployment on Vercel:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy with zero configuration

For other platforms, build the application with `npm run build` and serve the `out` directory.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
