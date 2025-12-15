DELETE FROM todoapp.todos;
INSERT INTO todoapp.todos(title,description,completed,user_id,created_at,updated_at) VALUES
    ('test','test','0',1,TIMESTAMP '2025-11-19 22:06:39.180',TIMESTAMP '2025-11-19 22:06:39.180')
  , ('test2','test2','0',1,TIMESTAMP '2025-11-19 22:21:01.770',TIMESTAMP '2025-11-20 08:39:53.154')
  , ('aa','aa','0',1,TIMESTAMP '2025-11-20 21:14:25.505',TIMESTAMP '2025-11-20 21:14:25.505');
