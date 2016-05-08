import fs from 'fs';
import path from 'path';

import _ from 'lodash';
import toml from 'toml';

import loadPosts from '../utils/loadPosts';
import getPreFoldContent from '../utils/getPreFoldContent';
import fixLocalLinks from '../utils/fixLocalLinks';
import appendToLastTextBlock from '../utils/appendToLastTextBlock';


const allPath = path.join(__dirname, '../public/all.json');
const recentPath = path.join(__dirname, '../public/recent.json');
const configPath = path.join(__dirname, '../config.toml');

const config = toml.parse(fs.readFileSync(configPath).toString());

const posts = loadPosts();

const json = _.map(posts, post => {
  const preFoldContent = fixLocalLinks(config.domain, getPreFoldContent(post.body));
  const url = config.domain + post.data.path;
  const readMore = ` <a href="${url}">Read more&nbsp;»</a>`;
  const withCallToAction = appendToLastTextBlock(preFoldContent, readMore);

  return {
    title: post.data.title,
    date: post.data.date,
    preview: withCallToAction,
    url,
    tags: post.data.tags
  };
});

fs.writeFileSync(allPath, JSON.stringify(json, null, '  '));
fs.writeFileSync(recentPath, JSON.stringify(json.slice(0, 10), null, '  '));