export const rulePrefix = '(#?(位置|座位|图书馆|lib))'
export async function checkPnpm () {
    let npm = 'npm'
    let ret = await execSync('pnpm -v')
    if (ret.stdout) npm = 'pnpm'
    return npm
  }