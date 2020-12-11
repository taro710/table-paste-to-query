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
  splited.forEach((data) => {
    trimmed.push(data.trim());
  });
  tableRows.push(trimmed);
});

// SQL出力
reader.on('close', () => {
  // ヘッダーのカラム名を''で囲う
  const tableHeader: string[] = tableRows[1].map((headerField) => {
    return `'${headerField}'`;
  });
  const tableHeaderJoin: string = tableHeader.join(',');
  let queryPrefix: string = `insert into ${TABLE_NAME} (${tableHeaderJoin}) values `;

  // ヘッダーを除去
  tableRows.splice(0, 3);
  // 末尾の直線を除去
  tableRows.pop();

  const RowLength: number = tableRows.length;
  const tableBody = tableRows.map((fields: string[]) => {
    return fields.map((field: string, i) => {
      // 指定されたカラムナンバーのフィールドは''で囲う
      if (STRING_TABLE_NUMBER.indexOf(i + 1) !== -1) {
        return `'${field}'`;
      } else {
        return field;
      }
    });
  });

  // tableBodyのフィールドを連結したものを、queryPrefixの末尾に連結
  let i = 1;
  tableBody.forEach((fields: string[]) => {
    const delimiter: string = i == RowLength ? ';' : ',';
    queryPrefix += `(${fields.join(',')})${delimiter}\n`;
    i++;
  });
  // 書き出し
  try {
    const now: Date = new Date();
    const sqlPath: string = './result';
    if (!fs.existsSync(sqlPath)) {
      fs.mkdirSync(sqlPath);
    }
    fs.writeFileSync(`${sqlPath}/${now.getTime()}.sql`, queryPrefix);
    console.log(
      colors.green(`ファイル名：${now.getTime()}.sql で出力されました。`)
    );
  } catch (e) {
    console.log(e);
  }
});
