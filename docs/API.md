# PacketSense — API Documentation

Complete API reference for the PacketSense backend.

**Base URL:** `https://your-api.onrender.com`  
**Auth:** Bearer JWT token in `Authorization` header

---

## Authentication

### POST `/api/auth/signup`
Register a new user account.

**Request Body:**
```json
{
  "email": "student@example.com",
  "username": "student123",
  "password": "securepass",
  "full_name": "John Doe"
}
```

**Response (201):**
```json
{
  "user": {
    "id": "uuid",
    "email": "student@example.com",
    "username": "student123",
    "full_name": "John Doe",
    "is_active": true,
    "created_at": "2024-01-01T00:00:00Z"
  },
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer"
}
```

**Errors:**
- `409` — Email or username already exists

---

### POST `/api/auth/login`
Authenticate and receive a JWT token.

**Request Body:**
```json
{
  "email": "student@example.com",
  "password": "securepass"
}
```

**Response (200):** Same as signup response.

**Errors:**
- `401` — Invalid email or password
- `403` — Account deactivated

---

### GET `/api/auth/me`
Get the currently authenticated user's profile.

**Headers:** `Authorization: Bearer <token>`

**Response (200):** User object.

---

### PUT `/api/auth/me`
Update profile fields.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "full_name": "Jane Doe",
  "avatar_url": "https://example.com/avatar.jpg"
}
```

---

## Quiz

### GET `/api/quiz/categories`
List all quiz categories with question counts.

**Response (200):**
```json
[
  {
    "id": "uuid",
    "name": "OSI Model",
    "description": "Test your knowledge of the 7 layers",
    "icon": "🏗️",
    "question_count": 8
  }
]
```

### GET `/api/quiz/questions/{category_id}`
Get questions for a category (answers NOT included).

### POST `/api/quiz/submit` 🔒
Submit answers and get graded results.

**Request Body:**
```json
{
  "category_id": "uuid",
  "answers": [
    {"question_id": "uuid", "selected": 1},
    {"question_id": "uuid", "selected": 3}
  ]
}
```

**Response:** Detailed results with correct answers and explanations.

### GET `/api/quiz/history` 🔒
Get the user's past quiz attempts.

### GET `/api/quiz/stats` 🔒
Get aggregate quiz statistics.

---

## Protocols

### GET `/api/protocols`
List all available protocol visualizations.

### GET `/api/protocols/{slug}`
Get detailed protocol data with visualization steps.

**Slugs:** `tcp-handshake`, `tcp-retransmission`, `tcp-congestion`, `udp-communication`, `dns-lookup`, `arp-resolution`, `dhcp-assignment`, `http-vs-https`

### POST `/api/protocols/{slug}/save` 🔒
Save a simulation configuration.

### GET `/api/protocols/saved/list` 🔒
Get saved simulations.

---

## Troubleshoot

### GET `/api/troubleshoot/issues`
List all troubleshoot issue types.

### GET `/api/troubleshoot/questions/{issue_type}`
Get adaptive diagnostic questions.

### POST `/api/troubleshoot/analyze` 🔒
Submit answers and receive diagnosis.

### GET `/api/troubleshoot/history` 🔒
Get past troubleshoot sessions.

---

## Explain

### GET `/api/explain/topics`
List all available explanation topics.

### POST `/api/explain`
Get a student-friendly explanation.

**Request Body:**
```json
{
  "topic": "tcp",
  "context": "troubleshoot"
}
```

**Response:**
```json
{
  "topic": "tcp",
  "explanation": "TCP is like a reliable postal service...",
  "analogy": "Think of TCP like sending a certified letter...",
  "key_points": ["Connection-oriented", "Reliable delivery", "..."],
  "related_topics": ["udp", "tcp-handshake"]
}
```

---

## Health

### GET `/`
Basic health check.

### GET `/api/health`
Health check with database connectivity test.

---

🔒 = Requires `Authorization: Bearer <token>` header
