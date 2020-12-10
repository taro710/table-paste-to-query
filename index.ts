import readlineSync from 'readline-sync';
import colors from 'colors/safe';
import readline from 'readline';
import fs from 'fs';
import { TABLE_NAME, STRING_TABLE_NUMBER } from './params';

// 確認(対話形式)
if (
  readlineSync.keyInYN(
    colors.green('【確認】') + 'params.tsの編集を忘れないように注意！'
  )
) {
} else {
  console.log(colors.yellow('処理中断'));
  process.exit();
}

const stream = fs.createReadStream('./table.txt', 'utf8');
const reader = readline.createInterface({ input: stream });
let tableRows: string[][] = [];

// 文字列操作
reader.on('line', (line: string) => {
  const sliced: string = line.slice(1, -1);
  const splited: string[] = sliced.split('|');
  const trimmed: string[] = [];
  let i = 1;
  splited.forEach((data) => {
    STRING_TABLE_NUMBER.indexOf(i) !== -1
      ? trimmed.push(`'${data.trim()}'`)
      : trimmed.push(data.trim());
    i++;
  });
  tableRows.push(trimmed);
});

// SQL出力
reader.on('close', () => {
  const header: string[] = tableRows[1];
  tableRows.splice(0, 3);
  tableRows.pop();
  const headerJoin: string = header.join(',');
  let queryPrefix: string = `insert into ${TABLE_NAME} (${headerJoin}) values `;
  const listLength: number = tableRows.length;
  let i = 1;
  tableRows.forEach((tableRowData) => {
    const delimiter: string = i == listLength ? ';' : ',';
    queryPrefix += `(${tableRowData.join(',')})${delimiter}\n`;
    i++;
  });
  try {
    const now: Date = new Date();
    const sqlPath: string = './result';
    if (!fs.existsSync(sqlPath)) {
      fs.mkdirSync(sqlPath);
    }
    fs.writeFileSync(`${sqlPath}/${now.getTime()}.sql`, queryPrefix);
    console.log(
      colors.green(`ファイル名：${now.getTime()}.sql　で出力されました。`)
    );
  } catch (e) {
    console.log(e);
  }
});
