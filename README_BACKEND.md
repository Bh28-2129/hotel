# Hotel Backend (Node.js + Express + MongoDB Atlas)

This backend is added **without changing your existing frontend**. It serves the current HTML/CSS/JS as static files and also exposes REST APIs you can integrate later.

## 1) Setup

1. Create a `.env` file in the project root (same folder as `server.js`).
2. Copy values from `.env.example`.
3. Put your MongoDB Atlas connection string in `MONGODB_URI`.

## 2) Install & Run

```bash
npm install
npm run dev
```

Server will run at:
- Frontend: `http://localhost:3000/`
- Health: `http://localhost:3000/api/health`

## 3) API

### List bookings
`GET /api/bookings`

### Create booking
`POST /api/bookings`

Example JSON:
```json
{
  "name": "Bhargav",
  "phone": "9876543210",
  "email": "bhargav@example.com",
  "roomId": "S-101",
  "roomTitle": "Single Room",
  "checkIn": "2026-02-10",
  "checkOut": "2026-02-12",
  "paymentMethod": "upi",
  "paymentDetails": {
    "upiId": "bhargav@upi",
    "amount": 5000,
    "currency": "INR"
  }
}
```

### Cancel booking
`PATCH /api/bookings/:bookingId/cancel`

## Note
Right now your frontend still uses `localStorage`. To store bookings in MongoDB from the UI, we’d need a small frontend change to call these APIs.
