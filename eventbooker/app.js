const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;

// Middleware for parsing form data
app.use(bodyParser.urlencoded({ extended: true }));

// Set EJS as the templating engine
app.set("view engine", "ejs");

// Static files (styles)
app.use(express.static("public"));

// Temporary data storage for appointments
let appointments = [];

// Route to render the booking form
app.get("/", (req, res) => {
  // Check if there are any error messages in the query parameters
  const errorMessage = req.query.error || null;
  res.render("appointment", { appointments, errorMessage });
});

// Route to handle form submissions
app.post("/book-appointment", (req, res) => {
  const { name, contact, date, serviceType } = req.body;

  // Validate form data (basic client-side)
  if (!name || !contact || !date || !serviceType) {
    return res.redirect("/?error=All fields are required!");
  }

  // Server-side validation for date format (simplified example)
  const appointmentDate = new Date(date);
  if (appointmentDate <= new Date()) {
    return res.redirect("/?error=Please select a future date.");
  }

  // Check if the selected time is available (e.g., avoiding duplicate time slots)
  const existingAppointment = appointments.find((appointment) => appointment.date === date);
  if (existingAppointment) {
    return res.redirect("/?error=The selected time slot is already booked.");
  }

  // Store the validated appointment
  appointments.push({ name, contact, date, serviceType });

  // Redirect to the homepage after booking
  res.redirect("/");
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
