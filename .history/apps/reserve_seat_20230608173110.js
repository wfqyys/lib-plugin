// 导入所需库和模块
import { readFileSync, writeFileSync } from 'fs';
import path from 'path';
import { defaults } from 'request-promise';
import { Builder, By, Key, until } from 'selenium-webdriver';
import { Options } from 'selenium-webdriver/chrome';
import { promisify } from 'util';
const sleep = promisify(setTimeout);

// 获取个人信息与预约信息字典
function getData() {
  const users = JSON.parse(readFileSync('./Lib/users_dict.dll', 'utf-8'));
  const dataDict = JSON.parse(readFileSync('./Lib/data_dict.dll', 'utf-8'));
  return [users, dataDict];
}


// 选择日期
function chooseDate() {
  const currentHour = new Date().getHours();
  const currentDate = new Date().getDate();
  return currentHour >= 21 ? currentDate + 1 : currentDate;
}

// 计算时间Id
function getTime(start_time, end_time) {
  const start_time_hour = parseInt(start_time);
  const end_time_hour = parseInt(end_time);
  const start_num = start_time_hour % 1 === 0 ? start_time_hour * 60 : start_time_hour * 60 + 30;
  const end_num = end_time_hour % 1 === 0 ? end_time_hour * 60 : end_time_hour * 60 + 30;
  return [start_num, end_num];
}

// 创建浏览器对象并打开目标网站
async function startDriver(url) {
  console.log('打开登录界面...');
  const options = new Options();
  options.addArguments('--headless'); // 无界面模式
  const driver = new Builder().forBrowser('chrome').setChromeOptions(options).build();
  await driver.get(url);
  return driver;
}

// 找到账号和密码的输入框，输入账号、密码并提交
async function inputAccount(driver, users) {
  console.log('登录...');
  await driver.findElement(By.id('username')).sendKeys(users.Id);
  await driver.findElement(By.id('password')).sendKeys(users.passwd);
  await driver.findElement(By.id('login_submit')).click();
  await sleep(3000); // 等待3秒，避免页面还没加载完
  return driver;
}

// 登录
async function loginIn(url, users, cookiesPath = './Lib/cookies.dll') {
  const driver = await startDriver(url);
  const driverWithAccount = await inputAccount(driver, users);
  console.log('获取cookie...');
  const cookies = await driverWithAccount.manage().getCookies();
  await driverWithAccount.quit();
  writeFileSync(cookiesPath, JSON.stringify(cookies));
  console.log('已获取cookie...');
  return cookiesPath;
}

// 设置cookies
function setCookies(cookiesPath) {
  const cookies = JSON.parse(readFileSync(cookiesPath, 'utf-8'));
  const session = defaults({ jar: true });
  for (const cookie of cookies) {
    const { name, value } = cookie;
    session.cookie(name, value);
  }
  return session;
}

// 抢座请求
async function requestSeat(sess, roomId, seatId, start_num, end_num, date_num) {
  const year = new Date().getFullYear();
  const month = (new Date().getMonth() + 1).toString().padStart(2, '0');
  const headers = {
    Referer: `http://seat.yangtzeu.edu.cn/libseat-ibeacon/seatdetail?linkSign=activitySeat&roomId=${roomId}&date=${year}-${month}-${date_num}&buildId=1`,
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36 Edg/111.0.1661.44',
  };
  const res = await sess.get(`http://seat.yangtzeu.edu.cn/libseat-ibeacon/saveBook?seatId=${seatId}&date=${year}-${month}-${date_num}&start=${start_num}&end=${end_num}&type=1&captchaToken=`, { headers });
  return res;
}

// 抢座
async function getSeat(users, roomId, seatId, start_num, end_num, date_num = new Date().getDate()) {
  const cookiesPath = await loginIn(login_url, users);
  const sess = setCookies(cookiesPath);
  const res = await requestSeat(sess, roomId, seatId, start_num, end_num, date_num);
  const parsedRes = JSON.parse(res);
  return parsedRes;
}

// 规范输出
function printResult(users, status, onDate, begin, end, location, message) {
  console.log('-'.repeat(50));
  console.log('Id: ', users.Id);
  if (status === 'success') {
    console.log('onDate: ', onDate);
    console.log('location:', location);
    console.log('begin: ', begin);
    console.log('end: ', end);
  } else {
    console.log(message);
    console.log('Failed!!!');
  }
  console.log('-'.repeat(50));
}

// 主函数
async function main() {
  const [users, dataDict] = getData();
  const date_num = chooseDate();
  const [start_num, end_num] = getTime(dataDict.start_time, dataDict.end_time);
  const res = await getSeat(users, dataDict.roomId, dataDict.seatId, start_num, end_num, date_num);
  const status = res.status;
  if (status === 'success') {
    const { data } = res;
    printResult(users, status, data.onDate, data.begin, data.end, data.location);
  } else {
    printResult(users, status,  res.message);
  }
}

// 主程序入口
const login_url = 'https://cas.yangtzeu.edu.cn/authserver/login?service=https%3A%2F%2Fseat.yangtzeu.edu.cn%2Fremote%2Fstatic%2FcasAuth%2FgetServiceByVerifyTicket%2FcasLogin';
main();
setInterval(main, 300000); // 每5分钟执行一次
