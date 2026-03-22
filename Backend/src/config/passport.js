import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default function (passport) {
    const opts = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET,
    };

    passport.use(
        new JwtStrategy(opts, async (jwtPayload, done) => {
            try {
                // Check if the token is expired
                const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
                if (jwtPayload.exp && jwtPayload.exp < currentTime) {
                    return done(null, false, { message: "Token has expired" });
                }
                console.log("JWT Payload:", jwtPayload);
                // Fetch the user from the database
                const user = await prisma.user.findUnique({
                    where: { id: jwtPayload.id },
                    include: { admin: true, teacher: true, student: true },
                });

                if (!user) {
                    console.warn("User not found for ID:", jwtPayload.id);
                    return done(null, false, { message: "User not found" });
                }

                const roles = [];
                if (user.admin) roles.push("admin");
                if (user.teacher) roles.push("teacher");
                if (user.student) roles.push("student");

                console.log("Authenticated User:", { id: user.id, roles });
                return done(null, {
                    id: user.id,
                    username: user.username,
                    roles,
                });
            } catch (error) {
                console.error("Error in JWT strategy:", error);
                return done(error, false);
            }
        })
    );
}
