import { Router } from "express";
import passport from "passport";

const router = Router();

router.get('/github', passport.authenticate('github', {
    scope: ["user:email"],
    session: false
}))

  
router.get('/github/callback', passport.authenticate('github', {
    failureRedirect: '/error',
  successRedirect: '/successUser'

}), async(req, res) => {
    res.status(200).json(req.user)
})

export default router;
