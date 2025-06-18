// import NextAuth from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";

// const handler = NextAuth({
//   providers: [
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         email: { label: "Email", type: "email" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         // Call your backend login endpoint
//         const res = await fetch("https://snipe-enhanced-hopefully.ngrok-free.app/api/login", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             email: credentials.email,
//             password: credentials.password,
//           }),
//         });
//         const user = await res.json();
//         // Only allow admin users
//         if (res.ok && user && user.role === "admin") {
//           return {
//             id: user.id,
//             token: user.token,
//             email: user.email,
//             FirstName: user.FirstName,
//             role: user.role,
//           };
//         }
//         // If not admin, return null (login fails)
//         return null;
//       },
//     }),
//   ],
//   session: {
//     strategy: "jwt",
//   },
//   pages: {
//     signIn: "/auth", 
//   },
//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) {
//         token.id = user.id;
//         token.token = user.token;
//         token.email = user.email;
//         token.FirstName = user.FirstName;
//         token.role = user.role;
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       session.user.id = token.id;
//       session.user.token = token.token;
//       session.user.email = token.email;
//       session.user.FirstName = token.FirstName;
//       session.user.role = token.role;
//       // If not admin, redirect (on client, handle this in your page)
//       return session;
//     },
//     // Optionally, you can add a redirect callback if you want to force redirect after sign in
//     async redirect({ url, baseUrl, user }) {
//       // If user is not admin, redirect to /auth
//       if (user && user.role !== "admin") {
//         return `${baseUrl}/auth`;
//       }
//       return url;
//     },
//   },
// });

// export { handler as GET, handler as POST };

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Call your backend login endpoint
        const res = await fetch("https://snipe-enhanced-hopefully.ngrok-free.app/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          }),
        });
        const user = await res.json();
        // Allow any user with a token to log in
        if (res.ok && user && user.token) {
          return {
            id: user.id,
            token: user.token,
            email: user.email,
            FirstName: user.FirstName,
            LastName: user.LastName,
            MI: user.MI,
            SchoolID: user.SchoolID,
            Phone_Number: user.Phone_Number,
            created_at: user.created_at,
            role: user.role,
            AccountID: user.AccountID, 

          };
        }
        // If login fails, return null
        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth", 
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.token = user.token;
        token.email = user.email;
        token.FirstName = user.FirstName;
        token.LastName = user.LastName;
        token.MI = user.MI;
        token.SchoolID = user.SchoolID;
        token.Phone_Number = user.Phone_Number;
        token.created_at = user.created_at;
        token.role = user.role;
        token.AccountID = user.AccountID; 
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.token = token.token;
      session.user.email = token.email;
      session.user.FirstName = token.FirstName;
      session.user.LastName = token.LastName;
      session.user.MI = token.MI;
      session.user.SchoolID = token.SchoolID;
      session.user.Phone_Number = token.Phone_Number;
      session.user.created_at = token.created_at;
      session.user.role = token.role;
      session.user.AccountID = token.AccountID; 
      return session;
    },
  },
});

export { handler as GET, handler as POST };