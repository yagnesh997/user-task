import express from 'express';
import AuthController from '../../controllers/AuthController';
import validate from '../../middlewares/Validate'
import AuthValidation from '../../validations/AuthValidation';
import auth from '../../middlewares/Auth';
import passport from 'passport';
const router = express.Router();

router.post('/sign-up', validate(AuthValidation.signUp), AuthController.signUp)
router.post('/sign-in', validate(AuthValidation.signIn), AuthController.signIn)
router.get('/user/current', auth, AuthController.getCurrentUser);
router.get('/google', passport.authenticate('google', { scope: ['profile'] }))
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (_req, res) => {
    res.redirect('/profile');
});
router.get('/facebook', passport.authenticate('facebook'));
router.get('/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/' }), (_req, res) => {
    res.redirect('/profile');
});

export default router