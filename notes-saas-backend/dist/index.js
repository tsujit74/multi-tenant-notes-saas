"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const notesRoutes_1 = __importDefault(require("./routes/notesRoutes"));
const tenantRoutes_1 = __importDefault(require("./routes/tenantRoutes"));
const healthRoutes_1 = __importDefault(require("./routes/healthRoutes"));
const auth_1 = require("./middleware/auth");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/auth", authRoutes_1.default);
app.use("/notes", notesRoutes_1.default);
app.use("/tenants", tenantRoutes_1.default);
app.use("/health", healthRoutes_1.default);
// Example protected route
app.get("/notes", auth_1.authMiddleware, (req, res) => {
    res.json({ message: `Hello user ${req.user?.userId} from tenant ${req.user?.tenantId}` });
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
