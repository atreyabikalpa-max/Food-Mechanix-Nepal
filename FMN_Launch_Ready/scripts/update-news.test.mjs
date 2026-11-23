import test from 'node:test';
import assert from 'node:assert/strict';
import {parseFeed,plain} from './update-news.mjs';
test('RSS extraction preserves headline, link and text',()=>{
 const x=`<?xml version="1.0"?><rss><channel><item><title><![CDATA[Food safety &amp; farming]]></title><link>https://example.org/story</link><description><![CDATA[<p>Farmers report new food news.</p>]]></description><pubDate>Mon, 23 Nov 2026 04:00:00 GMT</pubDate></item></channel></rss>`;
 const a=parseFeed(x);assert.equal(a.length,1);assert.equal(a[0].title,'Food safety & farming');assert.equal(a[0].link,'https://example.org/story');assert.equal(a[0].excerpt,'Farmers report new food news.');
});
test('Atom entry extraction',()=>{
 const a=parseFeed('<feed><entry><title>New food standards</title><link href="https://example.org/report"/><updated>2026-11-23T06:00:00Z</updated><summary>Relevant report</summary></entry></feed>');
 assert.equal(a[0].link,'https://example.org/report');assert.equal(a[0].title,'New food standards');
});
test('HTML stripping',()=>assert.equal(plain('<p>Milk <b>and</b> cheese</p>'),'Milk and cheese'));
