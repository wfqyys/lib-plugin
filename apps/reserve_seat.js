// 导入所需库和模块
//引入Yunzai插件功能
import plugin from '../../../lib/plugins/plugin.js'
import{ rulePrefix } from '../utils/common.js'
import { readFileSync, writeFileSync } from 'fs';
import path from 'path';
const login_url = 'https://cas.yangtzeu.edu.cn/authserver/login?service=https%3A%2F%2Fseat.yangtzeu.edu.cn%2Fremote%2Fstatic%2FcasAuth%2FgetServiceByVerifyTicket%2FcasLogin';
   

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
                fnc: 'verify'
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
async BindId(){
    let id = parseInt(this.e.msg.replace(/[^0-9]/gi, ''))
    let user = this.e.user_id
    let passwd = this.passwd
    await redis.set(`lib-plugin:ID:${user}`, id)
    await redis.set(`lib-plugin:PASSWD:${passwd}`, passwd)
    this.reply('学号绑定成功', false)
};

// 取出用户的id,passwd
async getData () {
    let key = `lib-plugin:ID:${this.e.user_id}`
    let ck = await getCk(this.e)
    if (!ck) return false
    if (await redis.get(key)) return false
    let api = new MysSRApi('', ck)
    let userData = await api.getData('srUser')
    if (!userData?.data || _.isEmpty(userData.data.list)) return false
    userData = userData.data.list[0]
    let { game_id: gameid } = userData
    await redis.set(key, gameid)
    await redis.setEx(
      `STAR_RAILWAY:userData:${gameid}`,
      60 * 60,
      JSON.stringify(userData)
    )
    return userData
  }

// 选择日期
async chooseDate() {
    const currentHour = new Date().getHours();
    const currentDate = new Date().getDate();
    return currentHour >= 21 ? currentDate + 1 : currentDate;
  };

  // 计算时间Id
  async getTime(start_time, end_time) {
    const start_time_hour = parseInt(start_time);
    const end_time_hour = parseInt(end_time);
    const start_num = start_time_hour % 1 === 0 ? start_time_hour * 60 : start_time_hour * 60 + 30;
    const end_num = end_time_hour % 1 === 0 ? end_time_hour * 60 : end_time_hour * 60 + 30;
    return [start_num, end_num];
  };
  
}
