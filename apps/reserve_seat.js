// 导入所需库和模块
//引入Yunzai插件功能
import plugin from '../../../lib/plugins/plugin.js'
import{ rulePrefix } from '../utils/common.js'
import { readFileSync, writeFileSync } from 'fs';
import path from 'path';
const login_url = 'https://cas.yangtzeu.edu.cn/authserver/login?service=https%3A%2F%2Fseat.yangtzeu.edu.cn%2Fremote%2Fstatic%2FcasAuth%2FgetServiceByVerifyTicket%2FcasLogin';
   
// 选择日期
function chooseDate() {
    const currentHour = new Date().getHours();
    const currentDate = new Date().getDate();
    return currentHour >= 21 ? currentDate + 1 : currentDate;
  };

  // 计算时间Id
function getTime(start_time, end_time) {
  const start_time_hour = parseInt(start_time);
  const end_time_hour = parseInt(end_time);
  const start_num = start_time_hour % 1 === 0 ? start_time_hour * 60 : start_time_hour * 60 + 30;
  const end_num = end_time_hour % 1 === 0 ? end_time_hour * 60 : end_time_hour * 60 + 30;
  return [start_num, end_num];
};
// 创建浏览器对象并打开目标网站
async function startDriver(url) {
  console.log('打开登录界面...');
  const options = new options();
  options.addArguments('--headless'); // 无界面模式
  const driver = new Builder().forBrowser('chrome').setChromeOptions(options).build();
  await driver.get(url);
  return driver;
}
  
  // 找到账号和密码的输入框，输入账号、密码并提交
 async function  inputAccount(driver, users) {
    console.log('登录...');
    await driver.findElement(By.id('username')).sendKeys(users.Id);
    await driver.findElement(By.id('password')).sendKeys(users.passwd);
    await driver.findElement(By.id('login_submit')).click();
    await sleep(3000); // 等待3秒，避免页面还没加载完
    return driver;
  }

//导出  类  类名===文件名 继承  插件类  
export class Reserve extends plugin {
  constructor() {
      super({
          //后端信息
          name: 'lib-plugin',//插件名字，可以随便写
          dsc: 'plugin',//插件介绍，可以随便写
          event: 'message',//这个直接复制即可，别乱改
          priority: 2500,//执行优先级：数值越低越6
          rule: [
              {
                  //正则表达试
                  reg: `^${rulePrefix}(位置|座位)?(预约|预定)$`,
                  //函数
                  fnc: 'reserve'
              },
              {
                //正则表达试
                reg: `^${rulePrefix}(位置|座位)?(登录|登陆)$`,
                //函数
                fnc: 'BindId'
                },
                {
                    //正则表达试
                    reg: `^${rulePrefix}(账号|学号)?(绑定|添加)?20[0-9]{7}$`,
                    //函数
                    fnc: 'BindId'
                },
                {
                    reg: `^${rulePrefix}帮助$`,
                    fnc: 'help'
                },
          ]
      });
  };
// 帮助
  async help (e) {
    await runtimeRender(e, '/help/help.html')
  }
 //函数
 async reserve(){
    let user_id = plugin.user_id
 }
 async verify() {
    if (this.e.isGroup) {
        this.e.reply('请私聊使用~')
        return true
    }else{
        this.e.reply('请发送"#lib+学号"进行绑定学号')
        return false
    }
};

//学号绑定
async bindId() {
    this.verify()
    const qq = this.e.user_id;
    const message = this.e.message;
    const studentId = message.match(/20[0-9]{7}/)[0]; // 从消息中提取学号

    try {
      // 保存用户的学号信息
      await saveUserStudentId(qq, studentId);
      this.reply('学号绑定成功');
    } catch (error) {
      console.error('学号绑定失败:', error);
      this.reply('学号绑定失败，请稍后重试');
    }
  }


}
