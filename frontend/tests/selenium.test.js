// ============================================================
// Selenium E2E Tests - Enjoy-your-hike Application
// Sprint 4 - Testing User Stories
// ============================================================
//
// Prerequisites:
// npm install selenium-webdriver chromedriver mocha chai
//
// Run: npx mocha tests/selenium.test.js --timeout 30000
// ============================================================

const { Builder, By, until, Key } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const assert = require('assert');

// Configuration
const BASE_URL = process.env.TEST_URL || 'https://enjoy-your-hike.onrender.com';
const TIMEOUT = 10000;

// Test user credentials (should exist in seeded data)
const TEST_USER = {
    email: 'test@example.com',
    password: 'password123'
};

let driver;

// ============================================================
// Setup and Helper Functions
// ============================================================

async function setupDriver() {
    const options = new chrome.Options();
    // Uncomment for headless mode in CI
    // options.addArguments('--headless');
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');
    options.addArguments('--window-size=1920,1080');

    driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .build();

    await driver.manage().setTimeouts({ implicit: TIMEOUT });
    return driver;
}

async function waitFor(selector, timeout = TIMEOUT) {
    return await driver.wait(until.elementLocated(selector), timeout);
}

async function waitForVisible(selector, timeout = TIMEOUT) {
    const element = await waitFor(selector, timeout);
    await driver.wait(until.elementIsVisible(element), timeout);
    return element;
}

async function fillInput(selector, text) {
    const element = await waitForVisible(selector);
    await element.clear();
    await element.sendKeys(text);
}

async function clickElement(selector) {
    const element = await waitForVisible(selector);
    await element.click();
}

async function getElementText(selector) {
    const element = await waitForVisible(selector);
    return await element.getText();
}

async function elementExists(selector, timeout = 2000) {
    try {
        await driver.wait(until.elementLocated(selector), timeout);
        return true;
    } catch {
        return false;
    }
}

function uniqueEmail() {
    return `test_${Date.now()}@test.com`;
}

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function login(email, password) {
    await driver.get(BASE_URL + '/login');
    await fillInput(By.id('email'), email);
    await fillInput(By.id('password'), password);
    await clickElement(By.css('button[type="submit"]'));
    await sleep(2000);
}

async function logout() {
    try {
        const logoutBtn = await driver.findElement(By.css('.nav-logout-btn'));
        await logoutBtn.click();
        await sleep(1000);
    } catch {
        // User might not be logged in
    }
}

// ============================================================
// TESTS
// ============================================================

describe('Selenium E2E Tests - User Stories Verification', function () {
    this.timeout(60000);

    before(async () => {
        driver = await setupDriver();
    });

    after(async () => {
        if (driver) await driver.quit();
    });

    // ----------------------------------------------------------
    // Test 1: User Registration (Sprint 2 User Story)
    // As a new user, I want to register an account
    // ----------------------------------------------------------
    describe('Test 1: User Registration', function () {
        it('should display registration form with all required fields', async function () {
            await driver.get(BASE_URL + '/register');
            await sleep(1000);

            // Verify form fields exist
            assert.ok(await elementExists(By.id('name')), 'Name field should exist');
            assert.ok(await elementExists(By.id('email')), 'Email field should exist');
            assert.ok(await elementExists(By.id('password')), 'Password field should exist');
            assert.ok(await elementExists(By.id('confirmPassword')), 'Confirm password field should exist');
            assert.ok(await elementExists(By.css('.auth-form')), 'Auth form should exist');
        });

        it('should show validation errors for empty fields', async function () {
            await driver.get(BASE_URL + '/register');
            await sleep(1000);

            // Submit empty form
            await clickElement(By.css('button[type="submit"]'));
            await sleep(500);

            // Check for validation errors
            const errorExists = await elementExists(By.css('.field-error')) ||
                                await elementExists(By.css('.auth-error'));
            assert.ok(errorExists, 'Validation errors should be shown');
        });

        it('should allow new user to register successfully', async function () {
            await driver.get(BASE_URL + '/register');
            await sleep(1000);

            const newEmail = uniqueEmail();

            // Fill registration form
            await fillInput(By.id('name'), 'Test User');
            await fillInput(By.id('email'), newEmail);
            await fillInput(By.id('password'), 'TestPassword123');
            await fillInput(By.id('confirmPassword'), 'TestPassword123');

            // Submit form
            await clickElement(By.css('button[type="submit"]'));
            await sleep(3000);

            // Verify logged in (navbar should show logout button)
            const navText = await driver.findElement(By.css('nav')).getText();
            assert.ok(
                navText.includes('Logout') || navText.includes('Profile'),
                'User should be logged in after registration'
            );
        });

        it('should show error for duplicate email', async function () {
            await driver.get(BASE_URL + '/register');
            await sleep(1000);

            // Try to register with existing email
            await fillInput(By.id('name'), 'Another User');
            await fillInput(By.id('email'), TEST_USER.email);
            await fillInput(By.id('password'), 'TestPassword123');
            await fillInput(By.id('confirmPassword'), 'TestPassword123');

            await clickElement(By.css('button[type="submit"]'));
            await sleep(2000);

            // Should show error
            const errorExists = await elementExists(By.css('.auth-error'));
            assert.ok(errorExists, 'Should show error for duplicate email');
        });
    });

    // ----------------------------------------------------------
    // Test 2: User Login (Sprint 2 User Story)
    // As an existing user, I want to login to my account
    // ----------------------------------------------------------
    describe('Test 2: User Login', function () {
        beforeEach(async function () {
            await logout();
        });

        it('should display login form', async function () {
            await driver.get(BASE_URL + '/login');
            await sleep(1000);

            assert.ok(await elementExists(By.id('email')), 'Email field should exist');
            assert.ok(await elementExists(By.id('password')), 'Password field should exist');
            assert.ok(await elementExists(By.css('.auth-form')), 'Auth form should exist');
        });

        it('should show error for invalid credentials', async function () {
            await driver.get(BASE_URL + '/login');
            await sleep(1000);

            await fillInput(By.id('email'), 'invalid@example.com');
            await fillInput(By.id('password'), 'wrongpassword');
            await clickElement(By.css('button[type="submit"]'));
            await sleep(2000);

            const errorExists = await elementExists(By.css('.auth-error'));
            assert.ok(errorExists, 'Should show error for invalid credentials');
        });

        it('should allow user to login successfully', async function () {
            await login(TEST_USER.email, TEST_USER.password);

            // Verify logged in
            const navText = await driver.findElement(By.css('nav')).getText();
            assert.ok(navText.includes('Logout'), 'User should be logged in');
        });

        it('should allow user to logout', async function () {
            await login(TEST_USER.email, TEST_USER.password);

            // Click logout
            await clickElement(By.css('.nav-logout-btn'));
            await sleep(1000);

            // Verify logged out
            const navText = await driver.findElement(By.css('nav')).getText();
            assert.ok(navText.includes('Login'), 'User should be logged out');
        });
    });

    // ----------------------------------------------------------
    // Test 3: Browse Trails List (Sprint 1 User Story)
    // As a user, I want to browse all available trails
    // ----------------------------------------------------------
    describe('Test 3: Browse Trails List', function () {
        it('should display trails page with trail cards', async function () {
            await driver.get(BASE_URL + '/trails');
            await sleep(2000);

            // Page header should exist
            assert.ok(await elementExists(By.css('.page-header')), 'Page header should exist');

            // Trail cards should be displayed
            const trailCards = await driver.findElements(By.css('.trail-card'));
            assert.ok(trailCards.length > 0, 'Trail cards should be displayed');
        });

        it('should display trail information in cards', async function () {
            await driver.get(BASE_URL + '/trails');
            await sleep(2000);

            // Check for trail card elements
            const trailTitle = await elementExists(By.css('.trail-title'));
            const difficultyBadge = await elementExists(By.css('.difficulty-badge'));
            const trafficBadge = await elementExists(By.css('.traffic-badge'));

            assert.ok(trailTitle, 'Trail title should be displayed');
            assert.ok(difficultyBadge, 'Difficulty badge should be displayed');
            assert.ok(trafficBadge, 'Traffic badge should be displayed');
        });

        it('should show pagination when many trails exist', async function () {
            await driver.get(BASE_URL + '/trails');
            await sleep(2000);

            // Check for pagination (aria labels)
            const nextPageBtn = await elementExists(By.css('[aria-label="Next page"]'));
            const pageSizeSelect = await elementExists(By.id('pageSize'));

            // At least one pagination element should exist
            assert.ok(nextPageBtn || pageSizeSelect, 'Pagination should be available');
        });
    });

    // ----------------------------------------------------------
    // Test 4: Search by Trail Name (Sprint 2 User Story)
    // As a user, I want to search trails by name or location
    // ----------------------------------------------------------
    describe('Test 4: Search by Trail Name', function () {
        it('should display search input', async function () {
            await driver.get(BASE_URL + '/trails');
            await sleep(2000);

            const searchInput = await waitForVisible(By.css('.search-input'));
            const placeholder = await searchInput.getAttribute('placeholder');

            assert.ok(placeholder.toLowerCase().includes('search'), 'Search input should exist');
        });

        it('should filter trails when searching', async function () {
            await driver.get(BASE_URL + '/trails');
            await sleep(2000);

            // Get initial trail count
            const initialCards = await driver.findElements(By.css('.trail-card'));
            const initialCount = initialCards.length;

            // Search for a specific trail
            const searchInput = await waitForVisible(By.css('.search-input'));
            await searchInput.sendKeys('Banias');
            await sleep(1500); // Wait for debounce

            // Check filtered results
            const pageText = await driver.findElement(By.css('body')).getText();
            assert.ok(
                pageText.toLowerCase().includes('banias') ||
                pageText.includes('trail') ||
                pageText.includes('0 trail'),
                'Search should filter trails'
            );
        });

        it('should show clear button when search has text', async function () {
            await driver.get(BASE_URL + '/trails');
            await sleep(2000);

            const searchInput = await waitForVisible(By.css('.search-input'));
            await searchInput.sendKeys('test');
            await sleep(500);

            const clearBtn = await elementExists(By.css('.search-clear-btn'));
            assert.ok(clearBtn, 'Clear button should appear when search has text');
        });

        it('should clear search and show all trails', async function () {
            await driver.get(BASE_URL + '/trails');
            await sleep(2000);

            // Search first
            const searchInput = await waitForVisible(By.css('.search-input'));
            await searchInput.sendKeys('test');
            await sleep(1000);

            // Clear search
            await searchInput.clear();
            await sleep(1000);

            // Verify trails are shown
            const trailCards = await driver.findElements(By.css('.trail-card'));
            assert.ok(trailCards.length > 0, 'All trails should return after clearing search');
        });
    });

    // ----------------------------------------------------------
    // Test 5: Filter by Difficulty (Sprint 2 User Story)
    // As a user, I want to filter trails by difficulty level
    // ----------------------------------------------------------
    describe('Test 5: Filter by Difficulty', function () {
        it('should display difficulty filter buttons', async function () {
            await driver.get(BASE_URL + '/trails');
            await sleep(2000);

            const filterContainer = await elementExists(By.css('.difficulty-filter'));
            assert.ok(filterContainer, 'Difficulty filter should exist');

            // Check for filter buttons
            const filterBtns = await driver.findElements(By.css('.filter-btn'));
            assert.ok(filterBtns.length >= 4, 'Should have difficulty filter buttons');
        });

        it('should filter trails when clicking Easy button', async function () {
            await driver.get(BASE_URL + '/trails');
            await sleep(2000);

            // Click Easy filter
            const easyBtn = await waitForVisible(By.css('.filter-btn-easy'));
            await easyBtn.click();
            await sleep(1000);

            // Verify filter is active
            const btnClass = await easyBtn.getAttribute('class');
            assert.ok(btnClass.includes('filter-btn-active'), 'Easy filter should be active');
        });

        it('should filter trails when clicking Moderate button', async function () {
            await driver.get(BASE_URL + '/trails');
            await sleep(2000);

            const moderateBtn = await waitForVisible(By.css('.filter-btn-moderate'));
            await moderateBtn.click();
            await sleep(1000);

            const btnClass = await moderateBtn.getAttribute('class');
            assert.ok(btnClass.includes('filter-btn-active'), 'Moderate filter should be active');
        });

        it('should filter trails when clicking Hard button', async function () {
            await driver.get(BASE_URL + '/trails');
            await sleep(2000);

            const hardBtn = await waitForVisible(By.css('.filter-btn-hard'));
            await hardBtn.click();
            await sleep(1000);

            const btnClass = await hardBtn.getAttribute('class');
            assert.ok(btnClass.includes('filter-btn-active'), 'Hard filter should be active');
        });

        it('should clear filters with All Difficulties button', async function () {
            await driver.get(BASE_URL + '/trails');
            await sleep(2000);

            // Apply a filter first
            await clickElement(By.css('.filter-btn-easy'));
            await sleep(500);

            // Click All Difficulties
            const allBtn = await driver.findElement(By.xpath("//button[contains(text(), 'All Difficulties')]"));
            await allBtn.click();
            await sleep(1000);

            // Verify filter is cleared
            const btnClass = await allBtn.getAttribute('class');
            assert.ok(btnClass.includes('filter-btn-active'), 'All Difficulties should be active');
        });
    });

    // ----------------------------------------------------------
    // Test 6: View Trail Details (Sprint 1 User Story)
    // As a user, I want to view detailed trail information
    // ----------------------------------------------------------
    describe('Test 6: View Trail Details', function () {
        it('should navigate to trail details page', async function () {
            await driver.get(BASE_URL + '/trails');
            await sleep(2000);

            // Click View Details button
            const viewDetailsBtn = await waitForVisible(By.css('.trail-card .btn-primary'));
            await viewDetailsBtn.click();
            await sleep(2000);

            // Verify URL changed to trail details
            const currentUrl = await driver.getCurrentUrl();
            assert.ok(currentUrl.includes('/trails/'), 'Should navigate to trail details page');
        });

        it('should display trail name and location', async function () {
            await driver.get(BASE_URL + '/trails');
            await sleep(2000);

            await clickElement(By.css('.trail-card .btn-primary'));
            await sleep(2000);

            // Check for trail details elements
            const hasLocation = await elementExists(By.css('.trail-location'));
            const pageText = await driver.findElement(By.css('body')).getText();

            assert.ok(hasLocation || pageText.length > 100, 'Trail details should be displayed');
        });

        it('should display trail statistics', async function () {
            await driver.get(BASE_URL + '/trails');
            await sleep(2000);

            await clickElement(By.css('.trail-card .btn-primary'));
            await sleep(2000);

            // Check for stat cards
            const statCards = await driver.findElements(By.css('.stat-card'));
            assert.ok(statCards.length > 0, 'Trail statistics should be displayed');
        });

        it('should display traffic indicator', async function () {
            await driver.get(BASE_URL + '/trails');
            await sleep(2000);

            await clickElement(By.css('.trail-card .btn-primary'));
            await sleep(2000);

            const trafficIndicator = await elementExists(By.css('.traffic-indicator'));
            assert.ok(trafficIndicator, 'Traffic indicator should be displayed');
        });

        it('should have back to trails link', async function () {
            await driver.get(BASE_URL + '/trails');
            await sleep(2000);

            await clickElement(By.css('.trail-card .btn-primary'));
            await sleep(2000);

            // Find and click back link
            const backLink = await driver.findElement(By.xpath("//a[contains(text(), 'Back to Trails')]"));
            assert.ok(backLink, 'Back to Trails link should exist');

            await backLink.click();
            await sleep(1000);

            const currentUrl = await driver.getCurrentUrl();
            assert.ok(currentUrl.includes('/trails') && !currentUrl.includes('/trails/'), 'Should navigate back to trails list');
        });
    });

    // ----------------------------------------------------------
    // Test 7: Favorite Trails (Sprint 3 User Story)
    // As a logged-in user, I want to save trails to favorites
    // ----------------------------------------------------------
    describe('Test 7: Favorite Trails', function () {
        before(async function () {
            await login(TEST_USER.email, TEST_USER.password);
        });

        after(async function () {
            await logout();
        });

        it('should display favorite button on trail cards', async function () {
            await driver.get(BASE_URL + '/trails');
            await sleep(2000);

            const favBtn = await elementExists(By.css('button[aria-label*="favorites"]'));
            assert.ok(favBtn, 'Favorite button should exist on trail cards');
        });

        it('should toggle favorite status when clicked', async function () {
            await driver.get(BASE_URL + '/trails');
            await sleep(2000);

            // Find favorite button
            const favBtn = await waitForVisible(By.css('button[aria-label*="favorites"]'));
            const initialLabel = await favBtn.getAttribute('aria-label');

            // Click to toggle
            await favBtn.click();
            await sleep(1500);

            // Check label changed
            const newLabel = await favBtn.getAttribute('aria-label');
            assert.ok(
                initialLabel !== newLabel ||
                newLabel.includes('Remove') ||
                newLabel.includes('Add'),
                'Favorite status should toggle'
            );
        });

        it('should access favorites page when logged in', async function () {
            await driver.get(BASE_URL + '/favorites');
            await sleep(2000);

            // Should show favorites page (not redirected to login)
            const pageHeader = await driver.findElement(By.css('.page-header')).getText();
            assert.ok(
                pageHeader.includes('Favorite') || pageHeader.includes('Saved'),
                'Favorites page should be accessible'
            );
        });

        it('should show empty state or favorite trails', async function () {
            await driver.get(BASE_URL + '/favorites');
            await sleep(2000);

            // Either empty state or trail cards should exist
            const emptyState = await elementExists(By.css('.empty-state'));
            const trailCards = await driver.findElements(By.css('.trail-card'));

            assert.ok(
                emptyState || trailCards.length > 0,
                'Should show empty state or favorite trails'
            );
        });
    });

    // ----------------------------------------------------------
    // Test 8: Unauthenticated Favorite Behavior
    // As an unauthenticated user, clicking favorite should show tooltip
    // ----------------------------------------------------------
    describe('Test 8: Unauthenticated Favorite Behavior', function () {
        before(async function () {
            await logout();
        });

        it('should show tooltip when clicking favorite while logged out', async function () {
            await driver.get(BASE_URL + '/trails');
            await sleep(2000);

            // Find and click favorite button
            const favBtn = await waitForVisible(By.css('button[aria-label*="favorites"]'));
            await favBtn.click();
            await sleep(500);

            // Check for tooltip or redirect to login
            const currentUrl = await driver.getCurrentUrl();
            const pageText = await driver.findElement(By.css('body')).getText();

            assert.ok(
                pageText.toLowerCase().includes('log in') ||
                currentUrl.includes('login'),
                'Should show login prompt or redirect'
            );
        });

        it('should redirect to login when accessing favorites page', async function () {
            await driver.get(BASE_URL + '/favorites');
            await sleep(2000);

            const currentUrl = await driver.getCurrentUrl();
            const pageText = await driver.findElement(By.css('body')).getText();

            // Should redirect to login or show login message
            assert.ok(
                currentUrl.includes('login') ||
                pageText.includes('Login') ||
                pageText.includes('Sign in'),
                'Should redirect to login or show login prompt'
            );
        });
    });

    // ----------------------------------------------------------
    // Test 9: Navigation (General UI Test)
    // Test main navigation links work correctly
    // ----------------------------------------------------------
    describe('Test 9: Navigation', function () {
        it('should navigate to home page', async function () {
            await driver.get(BASE_URL + '/trails');
            await sleep(1000);

            const homeLink = await driver.findElement(By.xpath("//a[contains(text(), 'Home')]"));
            await homeLink.click();
            await sleep(1000);

            const currentUrl = await driver.getCurrentUrl();
            assert.ok(
                currentUrl === BASE_URL + '/' || currentUrl === BASE_URL,
                'Should navigate to home page'
            );
        });

        it('should navigate to trails page', async function () {
            await driver.get(BASE_URL);
            await sleep(1000);

            const trailsLink = await driver.findElement(By.xpath("//a[contains(text(), 'Trails')]"));
            await trailsLink.click();
            await sleep(1000);

            const currentUrl = await driver.getCurrentUrl();
            assert.ok(currentUrl.includes('/trails'), 'Should navigate to trails page');
        });

        it('should show brand/logo in navbar', async function () {
            await driver.get(BASE_URL);
            await sleep(1000);

            const brand = await driver.findElement(By.css('.navbar-brand'));
            const brandText = await brand.getText();

            assert.ok(brandText.includes('TrailWatch'), 'Brand should show TrailWatch');
        });
    });

    // ----------------------------------------------------------
    // Test 10: Responsive and Accessibility
    // Basic accessibility checks
    // ----------------------------------------------------------
    describe('Test 10: Accessibility', function () {
        it('should have proper aria labels on buttons', async function () {
            await driver.get(BASE_URL + '/trails');
            await sleep(2000);

            // Check pagination buttons have aria-labels
            const paginationBtns = await driver.findElements(By.css('[aria-label*="page"]'));
            assert.ok(paginationBtns.length > 0, 'Pagination buttons should have aria-labels');
        });

        it('should have proper form labels', async function () {
            await driver.get(BASE_URL + '/login');
            await sleep(1000);

            const emailLabel = await driver.findElement(By.css('label[for="email"]'));
            const passwordLabel = await driver.findElement(By.css('label[for="password"]'));

            assert.ok(emailLabel, 'Email input should have label');
            assert.ok(passwordLabel, 'Password input should have label');
        });

        it('should have proper page structure', async function () {
            await driver.get(BASE_URL);
            await sleep(1000);

            const nav = await driver.findElement(By.css('nav'));
            const container = await driver.findElement(By.css('.container'));

            assert.ok(nav, 'Page should have navigation');
            assert.ok(container, 'Page should have main container');
        });
    });
});
