import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {writeJson} from './update-news.mjs';
export async function moderate(directory,task,id){
 if(!['approve','reject','unpublish'].includes(task)||!/^[-a-zA-Z0-9_]{1,100}$/.test(id||''))throw new Error('Choose approve, reject or unpublish and supply one exact story ID.');
 const load=async n=>JSON.parse(await fs.readFile(path.join(directory,'data',n),'utf8'));
 const data=await load('articles.json'),queue=await load('review.json'),decisions=await load('decisions.json');
 const list=task==='unpublish'?data.articles:queue.articles;
 const a=list.find(a=>a.id===id);if(!a)throw new Error('Story ID not found in the selected queue. No change made.');
 list.splice(list.indexOf(a),1);const stamp=new Date().toISOString();
 if(task==='approve'){data.articles.push({...a,status:'published',reviewedAt:stamp,reviewedBy:process.env.GITHUB_ACTOR||'local-editor'});data.articles.sort((a,b)=>+new Date(b.publishedAt)-+new Date(a.publishedAt));}
 decisions.articles.push({id:a.id,sourceUrl:a.sourceUrl,decision:task,decidedAt:stamp,editor:process.env.GITHUB_ACTOR||'local-editor'});
 data.generatedAt=stamp;
 await writeJson(path.join(directory,'data/articles.json'),data);
 await writeJson(path.join(directory,'data/review.json'),queue);
 await writeJson(path.join(directory,'data/decisions.json'),decisions);
 try{const status=await load('status.json');status.publishedCount=data.articles.length;status.pending=queue.articles.length;await writeJson(path.join(directory,'data/status.json'),status);}catch(e){if(e.code!=='ENOENT')throw e;}
 console.log(`${task}: ${id}`);
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
 try{await moderate(root,process.env.EDITOR_TASK||process.argv[2],process.env.STORY_ID||process.argv[3]);}catch(e){console.error(e.message);process.exitCode=1;}
}
