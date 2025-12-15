-- テスト中に作成されたデータを削除
-- 新規登録されたユーザー（newuserで始まるユーザー名）を削除
DELETE FROM todoapp.todos WHERE user_id IN (SELECT id FROM todoapp.users WHERE username LIKE 'newuser%');
DELETE FROM todoapp.users WHERE username LIKE 'newuser%';

-- testuser, testuser2のTodoを削除（各テストで作成されたTodo）
-- ※ユーザー自体は削除しない（テストで使用するため）
DELETE FROM todoapp.todos WHERE user_id IN (
  SELECT id FROM todoapp.users WHERE username IN ('testuser', 'testuser2')
);
