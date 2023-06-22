import _ from "lodash"
import crypto from "crypto"
import fetch from "node-fetch"

function random_string(n) {
    return _.sampleSize("0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ", n).join("")
  }
  
  function encrypt_data(data) {
    return crypto.publicEncrypt({
      key: publicKey,
      padding: crypto.constants.RSA_PKCS1_PADDING
    }, data).toString("base64")
  }
  
  function md5(data) {
    return crypto.createHash("md5").update(data).digest("hex")
  }
  
  function sleep(ms) {
    return new Promise(resolve=>setTimeout(resolve, ms))
  }

  async function request(url, sess, roomId, seatId, start_num, end_num, date_num) {
    const year = new Date().getFullYear();
    const month = (new Date().getMonth() + 1).toString().padStart(2, '0');
    const headers = {
      Referer: `http://seat.yangtzeu.edu.cn/libseat-ibeacon/seatdetail?linkSign=activitySeat&roomId=${roomId}&date=${year}-${month}-${date_num}&buildId=1`,
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36 Edg/111.0.1661.44',
    };
    const res = await sess.get(`http://seat.yangtzeu.edu.cn/libseat-ibeacon/saveBook?seatId=${seatId}&date=${year}-${month}-${date_num}&start=${start_num}&end=${end_num}&type=1&captchaToken=`, { headers });
    return res;
  }
