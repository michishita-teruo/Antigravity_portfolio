import { test, expect } from '@playwright/test';

test('Retro Mail Form works and targets correct email', async ({ page }) => {
    await page.goto('/retro/mail');

    // Fill form
    await page.getByTestId('name-input').fill('Test User'); // Name
    await page.getByTestId('email-input').fill('test@example.com'); // Mail Address
    await page.getByTestId('subject-input').fill('Test Subject'); // Subject
    await page.getByTestId('message-input').fill('This is a test message.'); // Message

    // CAPTCHA
    await page.getByTestId('captcha-input').fill('A');

    // Intercept the request to Google Forms
    let requestSent = false;
    console.log('Setting up route interception...');
    await page.route('**/docs.google.com/forms/**', route => {
        console.log('Route intercepted!');
        requestSent = true;
        route.fulfill({ status: 200, body: 'Mock Success' });
    });

    console.log('Clicking submit button...');
    await page.getByTestId('submit-button').click();

    // Verify the request was sent
    console.log('Waiting for request...');
    // Note: Since we use no-cors, the browser might not expose the response, but Playwright route should catch the request.
    // We just wait a bit to ensure the async fetch call happens
    await page.waitForTimeout(2000);
    console.log(`Request sent state: ${requestSent}`);
    expect(requestSent).toBe(true);

    // Check for success message
    await expect(page.getByText('Thank You!!')).toBeVisible();
    await expect(page.getByText('Googleスプレッドシートに記録されました。')).toBeVisible();
});
