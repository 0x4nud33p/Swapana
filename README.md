# Swapana (Swap + Solana) 🔄

A modern, feature-rich decentralized exchange (DEX) built on Solana blockchain for seamless token swapping with an intuitive user interface.

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/0x4nud33p/Swapana.git
   cd Swapana
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure your environment variables:
   ```env
    NEXT_PUBLIC_JUPITER_API_URL="https://lite-api.jup.ag/tokens/v2"
    NEXT_PUBLIC_JUPITER_QUOTE_API_URL="https://quote-api.jup.ag/v6"
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Key Components

### Swap Interface
- **SwapCard**: Main swap interface with token selection and amount input
- **TokenSelector**: Modal for choosing tokens with search functionality
- **Navbar**: Navigation with wallet connection and theme toggle

### Providers
- **WalletProvider**: Solana wallet connection management
- **ThemeProvider**: Dark/light mode state management
- **QueryProvider**: TanStack Query configuration

## 🌐 API Integration

The application integrates with:
- **Jupiter API**: For token swap quotes and routing
- **Solana RPC**: For blockchain interactions
- **Token List APIs**: For fetching available tokens

## 🎨 UI/UX Features

- **Responsive Design**: Works seamlessly on desktop and mobile
- **Accessibility**: ARIA-compliant components using Radix UI
- **Smooth Animations**: Framer Motion for delightful interactions
- **Toast Notifications**: Real-time feedback for user actions
- **Loading States**: Skeleton loaders and progress indicators

## 🔒 Security

- **No Private Key Storage**: Wallet connection via secure adapters
- **Input Validation**: Zod schemas for form validation
- **Type Safety**: TypeScript throughout the codebase
- **Secure RPC**: Configurable RPC endpoints

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Jupiter Protocol](https://jup.ag/) for DEX aggregation
- [Solana Labs](https://solana.com/) for the blockchain infrastructure

## 📞 Support

For support, please open an issue on GitHub or contact the development team.

---

**Built with ❤️ on Solana**