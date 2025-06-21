This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


#Folder Detail

checkbiz360-backoffice/
├── .github/                  # GitHub workflows and templates
├── .husky/                   # Git hooks
├── .vscode/                  # VSCode settings
├── public/                   # Static assets
│   ├── images/               # Global images
│   ├── fonts/                # Font files
│   ├── favicon.ico           # Favicon
│   └── robots.txt            # SEO configuration
├── src/
│   ├── app/                  # App Router directory
│   │   ├── (auth)/           # Auth-related routes
│   │   ├── (main)/           # Main app routes
│   │   ├── admin/            # Admin panel routes
│   │   ├── api/              # API routes
│   │   ├── layouts/          # Layout components
│   │   ├── lib/              # App Router utilities
│   │   └── [...catchAll]/    # Catch-all routes
│   ├── components/           # Reusable UI components
│   │   ├── common/           # Common components (buttons, inputs)
│   │   ├── features/         # Feature-specific components
│   │   ├── icons/            # Custom icons
│   │   ├── layouts/          # Layout components
│   │   └── ui/               # Low-level UI primitives
│   ├── config/               # App configuration
│   │   ├── constants.ts      # Application constants
│   │   ├── routes.ts         # Route definitions
│   │   └── theme.ts          # Theme configuration
│   ├── contexts/             # React contexts
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # Utilities and helpers
│   │   ├── api/              # API clients
│   │   ├── auth/             # Auth utilities
│   │   └── utils.ts          # General utilities
│   ├── middleware.ts         # Next.js middleware
│   ├── providers/            # Global providers
│   ├── services/             # Business logic/services
│   ├── stores/               # State management
│   ├── styles/               # Global styles
│   │   ├── globals.css       # Global CSS
│   │   └── theme/            # Theme styles
│   └── domain/                # TypeScript types
│       ├── api/              # API response types
│       ├── components/       # Component prop types
│       └── index.ts          # Main types export
├── .env.local                # Environment variables
├── .eslintrc.js              # ESLint configuration
├── .gitignore                # Git ignore rules
├── next.config.js            # Next.js configuration
├── package.json              # Project dependencies
├── README.md                 # Project documentation
└── tsconfig.json             # TypeScript configuration


novedades
pasos en como usar la plataforma