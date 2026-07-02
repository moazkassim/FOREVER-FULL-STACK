const allowedOrigins = [
  // Development
  "http://localhost:5173",
  "http://localhost:5174",

  // Production - replace with your actual deployed URLs
  "https://forever-frontend-delta-ruddy.vercel.app/",
  "https://forever-admin-seven-kappa.vercel.app/",
];

const corsOptions = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void,
  ) => {
    // Allow requests with no origin (like mobile apps, Postman, curl)
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log(`Blocked by CORS: ${origin}`);
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: [
    "Content-Type",
    "token",
    "Authorization",
    "X-Requested-With",
  ],
  credentials: true,
  optionsSuccessStatus: 200,
};

export default corsOptions;
