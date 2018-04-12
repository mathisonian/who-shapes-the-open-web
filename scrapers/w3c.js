const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

const workingGroupsURL = 'https://www.w3.org/2004/01/pp-impl/#groups';

const groups = {};
const companyIndex = {};

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}

async function run() {
  const browser = await puppeteer.launch();
  const outerPage = await browser.newPage();
  await outerPage.goto(workingGroupsURL);

  let content = await outerPage.content();
  const $ = cheerio.load(content);

  const arr = $('a[href*="/status"]').filter(function(i, element) {
    return $(this).attr('href').indexOf('#terms') === -1;
  }).toArray();


  await asyncForEach(arr, async function (element, i) {
    const groupName = $(element).prev('a').text();
    groups[groupName] = {
      name: groupName,
      url: 'https://www.w3.org/2004/01/pp-impl/' + $(element).attr('href'),
      members: []
    };

    const page = await browser.newPage();
    await page.goto('https://www.w3.org/2004/01/pp-impl/' + $(element).attr('href'));

    const curContent = await page.content();
    const $$ = cheerio.load(curContent);
    $$(':contains("W3C Member Organizations")').next().find('li').each(function (i, element) {
      const match = $(this).text().match(/(.*\(?[^(]+)\s*\(([0-9]*|no)\s*representative[s]?\)/)
      const company = match[1];
      const reps = match[2] === 'no' ? 0 : +match[2];

      groups[groupName].members.push({
        name: company,
        representatives: reps
      })

      if (!companyIndex[company]) {
        companyIndex[company] = reps + 1;
      }
    });
  })

  console.log(JSON.stringify(groups, null, 2));

  // Object.keys(companyIndex).sort((c1, c2) => {
  //   return companyIndex[c2] - companyIndex[c1];
  // }).filter((d, i) => i < 10).forEach(k => console.log(companyIndex[k]));

  // console.log(JSON.stringify(companyIndex, null, 2));

  // let
  // Object.keys(groups).forEach((g) => {
  //   const group = groups[g];


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
