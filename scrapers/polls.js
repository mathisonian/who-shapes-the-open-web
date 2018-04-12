const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

const baseURL = 'https://www.isidewith.com';
const pollsURL = 'https://www.isidewith.com/polls';

const polls = {};
const companyIndex = {};

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}

async function run() {
  const browser = await puppeteer.launch({
    headless: true
  });
  const outerPage = await browser.newPage();
  await outerPage.goto(pollsURL);

  let content = await outerPage.content();
  const $ = cheerio.load(content);

  const arr = $('a[href*="/poll/"]').filter(function(i, element) {
    return true;
    // return $(this).attr('href').indexOf('#terms') === -1;
  }).toArray();

  await asyncForEach(arr, async function (element, i) {

    const page = await browser.newPage();
    const url = baseURL + $(element).attr('href');
    console.log(url);
    await page.goto(url);

    const curContent = await page.content();
    const $$ = cheerio.load(curContent);

    const question = $$('#bannerQuestion').text();
    const yes = $$('.yes .perc').text();
    const no = $$('.no .perc').text();

    polls[question  ] = {
      url: url,
      question: question,
      yes: yes,
      no: no
    };
  })

  // Object.keys(companyIndex).sort((c1, c2) => {
  //   return companyIndex[c2] - companyIndex[c1];
  // }).filter((d, i) => i < 10).forEach(k => console.log(companyIndex[k]));

  console.log(JSON.stringify(polls, null, 2));

  // let
  // Object.keys(polls).forEach((g) => {
  //   const group = polls[g];


  // })


  // $('span.comhead').each(function(i, element){
  //   var a = $(this).prev();
  //   var rank = a.parent().parent().text();
  //   var title = a.text();
  //   var url = a.attr('href');
  //   var subtext = a.parent().parent().next().children('.subtext').children();
  //   var points = $(subtext).eq(0).text();
  //   var username = $(subtext).eq(1).text();
  //   var comments = $(subtext).eq(2).text();

  //   var metadata = {
  //     rank: parseInt(rank),
  //     title: title,
  //     url: url,
  //     points: parseInt(points),
  //     username: username,
  //     comments: parseInt(comments)
  //   };
  //   console.log(metadata);
  // });

  browser.close();
}

run();
