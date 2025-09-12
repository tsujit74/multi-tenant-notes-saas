import express from "express";
import cors from "cors";


import authRoutes from "./routes/authRoutes";
import notesRoutes from "./routes/notesRoutes";
import tenantRoutes from "./routes/tenantRoutes";
import healthRoutes from "./routes/healthRoutes";


import { authMiddleware } from "./middleware/auth";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/notes", notesRoutes);
app.use("/tenants", tenantRoutes);
app.use("/health", healthRoutes);


// Example protected route
app.get("/notes", authMiddleware, (req, res) => {
  res.json({ message: `Hello user ${req.user?.userId} from tenant ${req.user?.tenantId}` });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
