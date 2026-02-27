import dotenv from 'dotenv';
import { defineConfig } from '@playwright/test';
dotenv.config({ path: '.env.e2e' }); //change this to desired .env file

function provideReset(tag:number) {return {
    name: `reset-${tag}`,
    testMatch: /seed.e2e.(?:js|ts)/u,
};};

export default defineConfig({
    webServer: {
        command: 'npm run build && npm run preview',
        port: 4173,
    },
    testDir: 'tests/playwright',
    outputDir: 'playwright-results',
    projects: [
        // invalid login tests
        {
            name: 'invalid-logins',
            testMatch: /.e2e.(?:js|ts)/u,
            testDir: 'tests/playwright/invalid-login',
            fullyParallel: true,
        },
        // login tests
        {
            name: 'admin-auth',
            testMatch: /admin-auth.setup.e2e.(?:js|ts)/u,
            dependencies: ['invalid-logins'],
            fullyParallel: true,
        },
        {
            name: 'it-auth',
            testMatch: /it-auth.setup.e2e.(?:js|ts)/u,
            dependencies: ['invalid-logins'],
            fullyParallel: true,
        },

        // common tests
        {
            name: 'common-tests',
            dependencies: ['admin-auth', 'it-auth', 'invalid-logins'],
            testMatch: /.common.e2e.(?:js|ts)/u,
        },
        // common destructive tests, as they can't be easily parallelized due to deletions and stuff
        {
            name: 'common-destructive-tests',
            dependencies: ['common-tests'],
            testDir: 'tests/playwright/destructive',
            testMatch: /.e2e.(?:js|ts)/u,
        },
        {
            name: 'it-specific-tests',
            dependencies: ['common-tests', 'common-destructive-tests'],
            testDir: 'tests/playwright/it-specific',
            testMatch: /.e2e.(?:js|ts)/u,
        },
        {
            name: 'it-specific-destructive-tests',
            dependencies: ['it-specific-tests'],
            testDir: 'tests/playwright/it-specific/destructive',
            testMatch: /.e2e.(?:js|ts)/u,
        },

        // logout tests
        {
            name: 'logout',
            dependencies: [
                'it-specific-destructive-tests',
                'it-specific-tests',
                'common-tests',
                'common-destructive-tests',
                'invalid-logins',
            ],
            testDir: 'tests/playwright/logout',
            testMatch: /.e2e.(?:js|ts)/u,
            fullyParallel: true,
        },
    ],
    timeout: 60_000,
    expect: {
        timeout: 10_000,
    },
});
