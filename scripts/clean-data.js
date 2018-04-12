

const data = require('../w3c.json');

const orgIndex = {}

Object.keys(data).forEach((groupName) => {
  const group = {...data[groupName]};
  group.memberIndex = {};
  group.total = group.members.reduce((sum, member) => {
    member.name = member.name.trim();
    if (!orgIndex[member.name]) {
      orgIndex[member.name] = 0;
    }
    group.memberIndex[member.name] = member.representatives ? member.representatives : 0.5;;
    orgIndex[member.name] += group.memberIndex[member.name];
    return sum + group.memberIndex[member.name];
  }, 0);
  data[groupName] = group;
})

const fs = require('fs');

const orgs = Object.keys(orgIndex).map((key) => {
  return {
    name: key,
    value: orgIndex[key]
  };
})

const wgs = Object.keys(data).map(d => Object.assign({ name: d, ...data[d] }))

fs.writeFileSync(__dirname + '/../data/w3c-working-groups.json', JSON.stringify(wgs));
fs.writeFileSync(__dirname + '/../data/w3c-members.json', JSON.stringify(orgs));
