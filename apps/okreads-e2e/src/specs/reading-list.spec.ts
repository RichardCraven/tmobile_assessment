import { $, $$, browser, ExpectedConditions, element, by } from 'protractor';
import { expect } from 'chai';

describe('When: I use the reading list feature', () => {
  it('Then: I should see my reading list', async () => {
    await browser.get('/');
    await browser.wait(
      ExpectedConditions.textToBePresentInElement($('tmo-root'), 'okreads')
    );

    const readingListToggle = await $('[data-testing="toggle-reading-list"]');
    await readingListToggle.click();

    await browser.wait(
      ExpectedConditions.textToBePresentInElement(
        $('[data-testing="reading-list-container"]'),
        'My Reading List'
      )
    );
  });

  it('Should be able to mark as read', async () => {
    var EC = ExpectedConditions;
    const searchOptions = ['a','b','c','d','e','f','g','h','i','j','k','l','m']
    const option = searchOptions[Math.floor(Math.random()*searchOptions.length)]
    await browser.get('/');
    await browser.wait(
      EC.textToBePresentInElement($('tmo-root'), 'okreads')
    );

    const form = await $('form');
    const input = await $('input[type="search"]');
    await input.sendKeys(option);
    await form.submit();

    const btn = await element.all(by.className('want-to-read-btn')).last()
    await btn.click()

    const readingListToggle = await $('[data-testing="toggle-reading-list"]');
    await readingListToggle.click();
    await browser.wait(
      EC.textToBePresentInElement(
        $('[data-testing="reading-list-container"]'),
        'My Reading List'
      )
    );
    const el = await element.all(by.className('finish-book-button')).last()
    
    await browser.wait(EC.presenceOf(el))
    await browser.wait(EC.elementToBeClickable(el))
    await el.click()
    el.getAttribute('class').then((e)=>{expect(e).to.equal('finish-book-button finished')})
  })
});
