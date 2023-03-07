import passport from 'passport';
import LocalStrategy from 'passport-local';
import GoogleStragery from 'passport-google-oauth2';
import {User} from "../schemas/user.model";




passport.serializeUser((user, done) => {
    done(null, user)
});
passport.deserializeUser((user, done) => {
    done(null, user)
});
passport.use('local', new LocalStrategy(async (name, password, done) =>{
    const user = await User.findOne({name: name});
    if (!user){
        return done(null, false);
    }
    else {
        if (user.password == password){
            return done(null, user);
        } else {
            return done(null, false)
        }
    }
}));
// passport.use(new GoogleStragery({
//     clientID: '1079258411381-m5jfjtu1tn4cb1ugl8sdlvdf66n6espg.apps.googleusercontent.com',
//     clientSecret: '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',
//     callbackURL: 'http://localhost:3000/auth/google/callback',
//     passReqToCallback: true
// },
//     async (request, accessToken, refreshToken, profile, done) =>{
//     try{
//         let existingUser = await User.findOne({'google_id': profile.id});
//         console.log(typeof (profile.email))
//         if(existingUser){
//             return done(null,existingUser);
//         } else {
//             const newUser = new User({
//                 google_id: profile.id,
//                 username: profile.email,
//                 password: "Abcd123456",
//                 role: "user"
//             })
//             let userGoogle = await newUser.save()
//             console.log('Is new User' + userGoogle);
//             return done(null, newUser)
//         }
//     } catch(err){
//         console.log('error google login catch' + err.message);
//         return done(null, false)
//     }
//     }
//     ))

export default passport;
