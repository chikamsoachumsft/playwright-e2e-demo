import { test, expect } from '@playwright/test';
import path from 'path';

// Screenshots saved here — picked up by GitHub Actions workflow
const screenshotDir = path.join(__dirname, '..', 'screenshots');

// Tests against TodoMVC React app
// https://todomvc.com/examples/react/dist

test.describe('TodoMVC', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('');
  });

  test('has correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/TodoMVC/);
    await page.screenshot({ path: path.join(screenshotDir, 'homepage.png'), fullPage: true });
  });

  test('can add a new todo', async ({ page }) => {
    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Buy groceries');
    await input.press('Enter');

    const todoItem = page.locator('li').filter({ hasText: 'Buy groceries' });
    await expect(todoItem).toBeVisible();
    await page.screenshot({ path: path.join(screenshotDir, 'add-todo.png') });
  });

  test('can complete a todo', async ({ page }) => {
    // Add a todo
    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Write Playwright tests');
    await input.press('Enter');

    // Complete it
    const checkbox = page.getByRole('checkbox').first();
    await checkbox.check();

    // Verify it's marked as completed
    const todoItem = page.locator('li').filter({ hasText: 'Write Playwright tests' });
    await expect(todoItem).toHaveClass(/completed/);
    await page.screenshot({ path: path.join(screenshotDir, 'completed-todo.png') });
  });

  test('can add multiple todos', async ({ page }) => {
    const input = page.getByPlaceholder('What needs to be done?');

    const todos = ['Learn Playwright', 'Write tests', 'Ship to production'];

    for (const todo of todos) {
      await input.fill(todo);
      await input.press('Enter');
    }

    const todoItems = page.locator('ul.todo-list li, main ul li');
    await expect(todoItems).toHaveCount(3);
    await page.screenshot({ path: path.join(screenshotDir, 'multiple-todos.png') });
  });

  test('can filter active/completed todos', async ({ page }) => {
    const input = page.getByPlaceholder('What needs to be done?');

    // Add two todos
    await input.fill('Active task');
    await input.press('Enter');
    await input.fill('Completed task');
    await input.press('Enter');

    // Complete the second one
    const checkboxes = page.getByRole('checkbox');
    await checkboxes.nth(1).check();

    // Filter to active
    await page.getByRole('link', { name: 'Active' }).click();
    await expect(page.locator('main ul li')).toHaveCount(1);

    // Filter to completed
    await page.getByRole('link', { name: 'Completed' }).click();
    await expect(page.locator('main ul li')).toHaveCount(1);
    await page.screenshot({ path: path.join(screenshotDir, 'filtered-completed.png') });
  });

  test('shows correct item count', async ({ page }) => {
    const input = page.getByPlaceholder('What needs to be done?');

    await input.fill('Item 1');
    await input.press('Enter');
    await input.fill('Item 2');
    await input.press('Enter');
    await input.fill('Item 3');
    await input.press('Enter');

    await expect(page.getByText('3 items left!')).toBeVisible();
    await page.screenshot({ path: path.join(screenshotDir, 'item-count.png') });
  });
});
