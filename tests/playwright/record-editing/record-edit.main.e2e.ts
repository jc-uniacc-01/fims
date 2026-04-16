import { expect, type Page, test } from '@playwright/test';

import * as consts from '../../test-consts';
import * as fieldHelp from '../../test-helpers/field-test';

async function getFields(page: Page, fields: string[]) {
    const res: string[] = [];
    for (let idx = 0; idx < fields.length; idx++)
		switch (fields[idx]) {
			case 'Status':
				res.push(await page.getByRole('combobox', { name: fields[idx]}).inputValue());
				break;
			default:
				res.push(await page.getByRole('textbox', { name: fields[idx] }).inputValue());
		}

    return res;
}
async function getPrevLists(page: Page, expectedInputs: string[]) {}

async function editProfileFields(page: Page, inputs: string[]) {
    for (let idx = 0; idx < consts.profileTabFields.length; idx++)
        await fieldHelp.inputField(consts.profileTabFields[idx], inputs[idx], page);
}

async function verifyProfileFields(page: Page, inputs: string[]) {
    for (let idx = 0; idx < consts.profileTabFields.length; idx++)
        await fieldHelp.compareField(consts.profileTabFields[idx], inputs[idx], page);
}

// just filler for now
async function editSemRecFields(page: Page) {}
async function verifySemRecFields(page: Page) {}

async function editLists(page: Page, rowInputs: consts.testRowTuple[]) {
    for (const cur of rowInputs) {
        const header = cur[0];
        const addButtonText = cur[1];
        const colInputs = cur[2];
        const inputTypes = cur[3];

        await fieldHelp.testList(header, colInputs, inputTypes, addButtonText, page);
    }
}
async function verifyLists(page: Page, rowInputs: consts.testRowTuple[]) {
    for (const cur of rowInputs) {
        const header = cur[0];
        const colInputs = cur[2];

        await fieldHelp.compareList(header, colInputs, page);
    }
}

test.describe('editing record under profile tab', () => {
    test.use({ storageState: consts.AdminConfig });
    const sampleInputs = consts.getFieldTest();
    const sampleListInputs = consts.profileTabListSample();

    test('cancelled editing fields', async ({ page }) => {
        //go to faculty record
        await page.goto('/');
        await page.getByText('Mandario, Maricris').click(); // some random record

        //get previous values for comparison
        const prevInputs = await getFields(page, consts.profileTabFields);

        //edit
        const editButton = page.getByRole('button', { name: 'Edit' });

        await expect(editButton).toBeVisible();
        await editButton.click();

        await editProfileFields(page, sampleInputs);

        //cancel changes
        const cancelButton = page.getByRole('button', { name: 'Discard Changes', exact: true });
        await expect(cancelButton).toBeVisible();
        await cancelButton.click();

        //check if nothing changed
        await verifyProfileFields(page, prevInputs);
    });
    test('confirmed editing fields', async ({ page }) => {
        //go to faculty record
        await page.goto('/');
        await page.getByText('Camingao, Ericsson Jake').click(); // some random record

        //edit
        const editButton = page.getByRole('button', { name: 'Edit' });
        await expect(editButton).toBeVisible();
        await editButton.click();

        await editProfileFields(page, sampleInputs);

        //save changes
        const saveButton = page.getByRole('button', { name: 'Save Record', exact: true });
        await expect(saveButton).toBeVisible();
        await saveButton.click();

        //wait for loading
        await page.waitForTimeout(10); //in the case it loads very fast
        const loading = page.getByText('Loading...');
        if (await loading.isVisible()) await expect(loading).not.toBeVisible({ timeout: 10000 });

        //check if changed
        await verifyProfileFields(page, sampleInputs);
    });

	test('cancelled editing lists', async ({page}) => {
		//go to faculty record
		await page.goto('/')
		await page.getByText('Dela Cruz, Gabrielle Zach').click() // some random record

		//edit
		let editButton = page.getByRole('button', {name: 'Edit'});
		await expect(editButton).toBeVisible();
		await editButton.click();

		// add email to empty record
		fieldHelp.testList(
			'Emails',
			['test@up.edu.ph'],
			['textbox'],
			'+ Add Email',
			page
		)

		//cancel changes
		let cancelButton = page.getByRole('button', {name:'Discard Changes', exact:true});
		await expect(cancelButton).toBeVisible();
		await cancelButton.click();

		//check if email did not change
		await expect(page.getByText('test@up.edu.ph')).not.toBeVisible();
	});
	test ('confirm editing of lists by adding entries', async ({page}) => {

		//go to faculty record
		await page.goto('/')
		await page.getByText('Galinato, Eriene').click() // some random unmodified record

		//edit
		let editButton = page.getByRole('button', {name: 'Edit'});
		await expect(editButton).toBeVisible();
		await editButton.click();

		//add email
		fieldHelp.testList(
			'Emails',
			['test@up.edu.ph'],
			['textbox'],
			'+ Add Email',
			page
		)

		//save changes
		let saveButton = page.getByRole('button', {name:'Save Record', exact:true});
		await expect(saveButton).toBeVisible();
		await saveButton.click();

		//check if lists contain new email
		await expect(page.getByText('test@up.edu.ph')).not.toBeVisible();

	});
	test ('cancel editing of lists by deleting entries', async ({page}) => {
		//go to faculty record
		await page.goto('/')
		await page.getByText('Galinato, Eriene').click() // some random unmodified record

		//edit
		let editButton = page.getByRole('button', {name: 'Edit'});
		await expect(editButton).toBeVisible();
		await editButton.click();

		//attempt to delete email
		fieldHelp.deleteLastOfList('Emails', page)

		//cancel changes
		let cancelButton = page.getByRole('button', {name:'Discard Changes', exact:true});
		await expect(cancelButton).toBeVisible();
		await cancelButton.click();

		//check if lists contain no email
		await expect(page.getByText('test@up.edu.ph')).not.toBeVisible();
	});
});

test.describe('editing record under semestral records tab', () => {
	test.use({storageState:consts.AdminConfig});
	let sampleListInputs = consts.semRecsTabListSample();

	test('cancelled editing fields', async ({page}) => {
		//go to faculty record under semestral records tab
		await page.goto('/');
		await page.getByText('Camingao, Ericsson Jake').click(); // some random record with multiple promotion histories
		await page.getByRole('link', {name: 'Semestral Records', exact: true}).click();

		//edit
		let editButton = page.getByRole('button', {name: 'Edit'});
		await expect(editButton).toBeVisible();
		await editButton.click();

		// get current rank
		let rankField = page.getByRole('combobox', {name: 'Current Rank', exact: true})
		await rankField.isVisible()	
		let currentRank = await rankField.inputValue()

		// put in a different rank
		await rankField.selectOption('Instructor 2');
		
		// cancel changes
		let cancelButton = page.getByRole('button', {name:'Discard Changes', exact:true});
		await expect(cancelButton).toBeVisible();
		await cancelButton.click();

		let confirmButton = page.getByRole('button', {name: consts.SaveConfirmText, exact:true});
		await expect(confirmButton).toBeVisible();
		await confirmButton.click();
	
		// compare
		expect(await rankField.inputValue()).toBe(currentRank)
	})
	test('confirmed editing fields', async ({page}) => {
		//go to faculty record under semestral records tab
		await page.goto('/');
		await page.getByText('Camingao, Ericsson Jake').click(); // some random record with multiple promotion histories
		await page.getByRole('link', {name: 'Semestral Records', exact: true}).click();

		//edit
		let editButton = page.getByRole('button', {name: 'Edit'});
		await expect(editButton).toBeVisible();
		await editButton.click();

		// get current rank
		let rankField = page.getByRole('combobox', {name: 'Current Rank', exact: true})
		await rankField.isVisible()	
		let currentRank = await rankField.inputValue()

		// put in a different rank
		await rankField.selectOption('Instructor 2');
		

		//save changes
		let saveButton = page.getByRole('button', {name:'Save Record', exact:true});
		await expect(saveButton).toBeVisible();
		await saveButton.click();

		// compare
		expect(await rankField.inputValue()).not.toBe(currentRank)
	})

	test('cancelled editing lists', async ({page}) => {
		//go to faculty record under semestral records tab
		await page.goto('/');
		await page.getByText('Camingao, Ericsson Jake').click(); // some random unmodified record
		await page.getByRole('link', {name: 'Semestral Records', exact: true}).click();

		//get the last of each list
		let compares:consts.testRowTuple[] = []
		for (let e of sampleListInputs) {
			const header = e[0]
			const addButton = e[1]
			compares.push([
				header, addButton, await fieldHelp.getLastEntry(header, page), e[3]
			])
		}

		//edit
		let editButton = page.getByRole('button', {name: 'Edit'});
		await expect(editButton).toBeVisible();
		await editButton.click();

		//edit list
		fieldHelp.testList(
			'Nature of Membership',
			consts.sampleMembership(),
			consts.membershipInputs,
			'+ Add Committee Membership',
			page
		)

		//cancel changes
		let cancelButton = page.getByRole('button', {name:'Discard Changes', exact:true});
		await expect(cancelButton).toBeVisible();
		await cancelButton.click();

		//confirm cancel
		let confirmCancel = page.getByRole('button', {name:'Discard', exact:true});
		await expect(confirmCancel).toBeVisible()
		await confirmCancel.click()

		//check if list remain unchanged
		await expect(page.getByText('membership-test')).not.toBeVisible()
	});

	test ('confirm editing of lists', async ({page}) => {
		//go to faculty record under semestral records tab
		await page.goto('/');
		await page.getByText('Camingao, Ericsson Jake').click(); // some random unmodified record
		await page.getByRole('link', {name: 'Semestral Records', exact: true}).click();

		//get the last of each list
		let compares:consts.testRowTuple[] = []
		for (let e of sampleListInputs) {
			const header = e[0]
			const addButton = e[1]
			compares.push([
				header, addButton, await fieldHelp.getLastEntry(header, page), e[3]
			])
		}

		//edit
		let editButton = page.getByRole('button', {name: 'Edit'});
		await expect(editButton).toBeVisible();
		await editButton.click();

		//edit list
		fieldHelp.testList(
			'Nature of Membership',
			consts.sampleMembership(),
			consts.membershipInputs,
			'+ Add Committee Membership',
			page
		)

		//save changes
		let saveButton = page.getByRole('button', {name:'Save Record', exact:true});
		await expect(saveButton).toBeVisible();
		await saveButton.click();

		//check if list remain unchanged
		await expect(page.getByText('membership-test')).toBeVisible()
	});
});
