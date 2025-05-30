# Toolpad Core - Next.js App Router app with email provider

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

1. You need to have a Postgres database running. You can use the following docker command to start a Postgres database:

```bash
docker run --name postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres
```

2. For the database created above, the connection string is `postgresql://postgres:postgres@localhost:5432/postgres`.

3. Update the `DATABASE_URL` environment variable in the `.env` file with the connection string for the database you created above.

4. Then, generate the Prisma Client:

```bash
npx prisma migrate dev --schema=./src/prisma/schema.prisma
```

5. You also need to supply the following enviroment variables for the email server to work:

```bash
EMAIL_SERVER_HOST=
EMAIL_SERVER_PORT=
EMAIL_SERVER_USER=
EMAIL_SERVER_PASSWORD=
EMAIL_FROM=
```

6. Finally, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

7. Open [http://localhost:3000](http://localhost:3000) with your browser to see the app running.

## Clone using `create-toolpad-app`

To copy this example and customize it for your needs, run

```bash
npx create-toolpad-app@latest --example auth-nextjs-email
# or
pnpm dlx create-toolpad-app@latest --example auth-nextjs-email
```

and follow the instructions in the terminal.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
