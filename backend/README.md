
## Project Architecture

| Layer | Responsibility |
|---|---|
| `routes` | Define endpoints, HTTP methods, hooks, and schemas |
| `controller` | Extract request data and send responses |
| `service` | Handle business logic and business rules |
| `repository` | Handle Prisma queries and database operations |
| `schema` | Define Zod validation schemas |
| `types` | Define TypeScript types |
| `plugins` | Manage Fastify plugins and shared infrastructure |
| `middleware` | Handle authentication, authorization, and request context |
| `config` | Manage environment variables and application configuration |


Verification model Usage:
1. User requests email verification.
2. Generate a random verification token.
3. Store its hash in the database.
4. Send the raw token in an email link.
5. User clicks the link.
6. Hash the received token and compare it with the stored hash.
7. Check expiry and whether it was already used.
8. Mark the email as verified.
9. Same goes for the Password reset!!