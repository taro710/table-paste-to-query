# MySQL クエリジェネレータ

MySQL の CLI に表示されたテーブルをコピペすることで、INSERT クエリを出力する。

## 手順

1. モジュールインストール

```
cd table_paste_to_query
npm install
```

2. CLI からテーブルをコピー（左上の+から右下の+まで)

```
+---------+--------+--------+
| last    | first  | age    |
+---------+--------+--------+
| Sato    | Taro   | 10     |
| Ito     | Jiro   | 20     |
| Suzuki  | Keita  | 30     |
| Kaneda  | Hanako | 40     |
+---------+--------+--------+
```

3. `table.txt`にペースト
4. `params.ts`を編集

```typescript
export const TABLE_NAME: string = 'tb_human'; //テーブル名を入力
export const STRING_TABLE_NUMBER: number[] = [1, 2]; //文字列・日時が含まれるカラムナンバーを入力（クォーテーションが付与される）
```

5. 実行

```
npm run exec
```

6. `./result`に SQL ファイルが出力される

```sql
insert into tb_human
('last','first',age)
values
('Sato','Taro',10),
('Ito','Jiro',20),
('Suzuki','Keita',30),
('Kaneda','Hanako',40);
```

※ NULL などの非文字列と文字列が混在する場合、ひとまず文字列として出力し、後ほど'NULL'→NULL に全件置換するしかない
