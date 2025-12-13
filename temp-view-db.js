const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('db/vki-web.db');

// Получаем список таблиц
db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, tables) => {
  if (err) {
    console.error('Error:', err);
    db.close();
    return;
  }
  
  console.log('Tables in database:');
  console.log(JSON.stringify(tables, null, 2));
  
  // Для каждой таблицы получаем структуру и данные
  tables.forEach((table, index) => {
    setTimeout(() => {
      console.log(`\n=== Table: ${table.name} ===`);
      
      // Получаем структуру таблицы
      db.all(`PRAGMA table_info(${table.name})`, (err, info) => {
        if (err) {
          console.error('Error getting table info:', err);
          return;
        }
        console.log('Structure:');
        console.log(JSON.stringify(info, null, 2));
        
        // Получаем данные из таблицы
        db.all(`SELECT * FROM ${table.name}`, (err, rows) => {
          if (err) {
            console.error('Error getting data:', err);
            return;
          }
          console.log(`\nData (${rows.length} rows):`);
          console.log(JSON.stringify(rows, null, 2));
          
          if (index === tables.length - 1) {
            db.close();
          }
        });
      });
    }, index * 100);
  });
});


