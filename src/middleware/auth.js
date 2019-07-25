import { verify } from 'jsonwebtoken';
import { secretkey } from '../config/keys';


export default function (req, res, next) {
  // get token from header
  const token = req.header('x-auth-token');

  // check if there is no token
  if (!token) {
    return res.status(400).json({ msg: 'Authorization denied as no token present' });
  }

  // check the validity of the token
  try {
    const decoded = verify(token, secretkey);
    req.user = decoded.user; // this will give us the user:id in req.user.id
    next(); //call whatever is the next function
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Token not valid' });
  }

  return null;
}
