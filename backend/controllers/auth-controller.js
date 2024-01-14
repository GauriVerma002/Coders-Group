const otpService = require('../services/otp-service');
const hashService = require('../services/hash-service');
const userService = require('../services/user-service');
const tokenService = require('../services/token-service');
const UserDto = require('../dtos/user-dto');

class AuthController {
    async sendOtp(req, res) {
        const { phone } = req.body;
        try {
            if (!phone) {
                res.status(400).json({ message: 'phone field is required!' });
                return;
            }

            const otp = await otpService.generateOtp();


            //hash
            const ttl = 1000 * 60 * 10;
            const expires = Date.now() + ttl;
            const data = `${phone}.${otp}.${expires}`;
            const hash = hashService.hashOtp(data)


            //send otp
            // await otpService.sendBySms(phone, otp)
            res.json(
                {
                    hash: `${hash}.${expires}`,
                    phone,
                    otp,
                }
            );
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: 'message sending failed' });
        }
    }



    async verifyOtp(req, res) {
        const { otp, hash, phone } = req.body;
        try {
            if (!otp || !hash || !phone) {
                res.status(400).json({ message: 'All feilds are required!' });
                return;
            }

            const [hashOtp, expires] = hash.split('.');
            if (Date.now() > +expires) {
                res.status(400).json({ message: 'OTP expired!' });
                return;
            }

            const data = `${phone}.${otp}.${expires}`;

            const isValid = otpService.verifyOtp(hashOtp, data);
            if (!isValid) {
                res.status(400).json({ message: 'Invalid OTP' })
                return;
            }
            let user;

            try {
                user = await userService.findUser({ phone })
                if (!user) {
                    user = await userService.createUser({ phone })
                }
            } catch (err) {
                console.log(err);
                res.status(500).json({ message: 'db error' })
                return;
            }

            //token service
            const { accessToken, refreshToken } = tokenService.generateTokens({
                _id: user._id,
                activated: false,
            });

            await tokenService.storeRefreshToken(refreshToken, user._id);

            res.cookie('refreshToken', refreshToken, {
                maxAge: 1000 * 60 * 60 * 24 * 30,
                httpOnly: true,
            });

            res.cookie('accessToken', accessToken, {
                maxAge: 1000 * 60 * 60 * 24 * 30,
                httpOnly: true,
            });

            const userDto = new UserDto(user);
            res.json({ user: userDto, auth: true });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}


module.exports = new AuthController();