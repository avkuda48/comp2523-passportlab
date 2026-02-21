import { Strategy as GitHubStrategy, Profile } from 'passport-github2';
import { PassportStrategy } from '../../interfaces/index';
import { VerifyCallback } from 'passport-oauth2';
import { Request } from "express"
import { userModel, database } from '../../models/userModel';


const githubStrategy = new GitHubStrategy(
    {
        clientID: process.env.GITHUB_CLIENT_ID!,
        clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        callbackURL: "http://localhost:8000/auth/github/callback",
        passReqToCallback: true,
    },

    /* FIX ME 😭 */
    async (req: Request, accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => {
        // TODO: if you get the id out of the profile and cannot find a user in your db with that id
        // TODO:       THEN  create a user out of the profile -> insert into the database  

        try {
            const foundUser = userModel.findById(+profile.id);
            done(null, foundUser)
        } catch (error) {
            const gitUser = {
                id: +profile.id,
                name: profile.displayName,
                email: "",
                password: "",
                role: "user"
            }
            database.push(gitUser);
            done(null, gitUser);
        }
    }
);

const passportGitHubStrategy: PassportStrategy = {
    name: 'github',
    strategy: githubStrategy,
};

export default passportGitHubStrategy;
