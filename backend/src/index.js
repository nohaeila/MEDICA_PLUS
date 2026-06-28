const express = require("express")
const cors = require("cors")
require("dotenv").config()

const app = express()

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}))
app.use(express.json())

// Routes
const authRoutes = require("./routes/auth.routes")
const medecinRoutes = require("./routes/medecin.routes")
const rdvRoutes = require("./routes/rdv.routes")
const notificationRoutes = require("./routes/notification.routes")

app.use("/api/auth", authRoutes)
app.use("/api/medecins", medecinRoutes)
app.use("/api/rdv", rdvRoutes)
app.use("/api/notifications", notificationRoutes)

// Test route
app.get("/", (req, res) => {
  res.json({ message: "MEDICA+ API is running" })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Serveur lancé sur le port ${PORT}`)
})