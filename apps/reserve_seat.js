// 导入所需库和模块
//引入Yunzai插件功能
import plugin from '../../../lib/plugins/plugin.js'
import{ rulePrefix } from '../utils/common.js'
import { readFileSync, writeFileSync } from 'fs';
import path from 'path';
// import { defaults } from 'request-promise';
// import { Builder, By, Key, until } from 'selenium-webdriver';
// import { Options } from 'selenium-webdriver/chrome';


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
                fnc: 'login'
            }
          ]
      });
  };
 //函数
 async reserve(){

 }
 async login() {
    if (this.e.isGroup) {
      this.e.reply('请私聊使用~')
        return true
    }else{
        
    }
};
}
