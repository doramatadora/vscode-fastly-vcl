import matter from 'gray-matter'

async function pipedMatter () {
  let data = ''
  for await (const chunk of process.stdin) data += chunk
  return await matter(data, { autoAddIncludes: false, deserialize: false })
}

pipedMatter()
  .then(f => console.log(JSON.stringify(f)))
  .catch(e => console.error(e))
