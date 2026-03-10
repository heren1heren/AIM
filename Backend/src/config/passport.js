import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";

export default function (passport) {
    const opts = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET,
    };

    passport.use(
        new JwtStrategy(opts, (jwtPayload, done) => {
            // Example: attach user info from token
            return done(null, jwtPayload);
        })
    );
}
