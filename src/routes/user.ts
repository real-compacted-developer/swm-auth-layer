import { Router } from 'express';
import axios from 'axios';
import jwt from '../modules/jwt';

const router = Router();
const config = {
  headers: {
    'Content-Type': 'application/json',
  },
};
interface User {
  provider : string,
  id : string,
  nickname : string,
  email : string,
  profileImage : string,
  isPremium : boolean
}

router.post('/token', async (req, res) => {
  const { id } = req.body;
  try {
    const token = await jwt.sign({ id });
    res.json(token);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

router.get('/login/callback', async (req, res) => {
  const accessToken = req.headers.authorization;
  const header = `Bearer ${accessToken}`;
  const apiUrl = process.env.NAVER_CALLBACK_URL;
  const user = await axios({
    url: apiUrl,
    headers: { Authorization: header }
  });
  const userInfo = user.data.response;
  const userProfile : User = {
    provider: 'naver',
    id: userInfo.id,
    email: userInfo.email,
    nickname: userInfo.name,
    profileImage: userInfo.profile_image,
    isPremium: false
  };
  const userId = userProfile.provider + userProfile.id;
  const DBUser = await axios.get(`http://db.api.connectclass.io/user/${userId}`);
  const isUser: string = JSON.stringify(DBUser.data.success);
  let token;
  if (isUser === 'true') { // 이미 유저 정보가 Database에 있다.
    token = await jwt.sign(userInfo);
  } else {
    const body = JSON.stringify(userProfile);
    const result = await axios.post('http://db.api.connectclass.io/user', body, config);
    const msg: string = JSON.stringify(result.data.success);
    if (msg === 'true') {
      token = await jwt.sign(userInfo);
    }
  }
  res.json(token);
});

export default router;
