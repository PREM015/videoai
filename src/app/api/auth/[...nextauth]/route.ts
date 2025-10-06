import NextAuth from "next-auth";

import { authoptions } from "../../../../../lib/auth";

const handlers = NextAuth(authoptions);


export { handlers as GET, handlers as POST }