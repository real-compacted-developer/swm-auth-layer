import jsonwebtoken from 'jsonwebtoken';
import 'dotenv/config';

interface User {
  id : string
}
const jwt = {
  sign: (user : User) => {
    const payload = {
      id: user.id
    };
    const options: jsonwebtoken.SignOptions = {
      algorithm: 'HS256',
      expiresIn: '12h',
      issuer: 'ConnectClass'
    };

    const result = {
      token: `Bearer ${jsonwebtoken.sign(payload, process.env.JWT_SECRET_KEY!, options)}`
    };
    return result;
  }
};

export default jwt;
