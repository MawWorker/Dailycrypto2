const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'uiu9mgqs',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
  token: 'skPO20Qr6hg0WcszLAVCDlqBpb6uMq7c3OL2pbrSdAWCvxv0dReKjbmaLid0VuFRu2kczC5QI28ePXn2soec2sig28wayH3uY2xdX5x3mTjU26aeZ2oJ4wibCfiiIGW8ITJlqhixLFcKGJEM0pcy11Osn2IRMdOI43Pto4I4kMQiAK37tkzG',
});

async function test() {
  try {
    console.log('Testing Sanity connection...\n');
    
    // Test 1: List all document types
    console.log('1. Fetching all document types:');
    const types = await client.fetch('*[]{_type}');
    const uniqueTypes = [...new Set(types.map(t => t._type))];
    console.log('Available types:', uniqueTypes);
    console.log('');
    
    // Test 2: Count newsPost documents
    console.log('2. Counting newsPost documents:');
    const count = await client.fetch('count(*[_type == "newsPost"])');
    console.log(`Total newsPost documents: ${count}`);
    console.log('');
    
    // Test 3: Fetch a sample newsPost
    console.log('3. Fetching sample newsPost:');
    const sample = await client.fetch('*[_type == "newsPost"][0]{_id, title, slug, datePublished}');
    console.log('Sample:', JSON.stringify(sample, null, 2));
    console.log('');
    
    // Test 4: Fetch all newsPosts
    console.log('4. Fetching all newsPosts:');
    const posts = await client.fetch('*[_type == "newsPost"] | order(datePublished desc){_id, title, slug, datePublished}');
    console.log(`Found ${posts.length} posts:`);
    posts.forEach((post, i) => {
      console.log(`  ${i + 1}. ${post.title}`);
      console.log(`     Slug: ${post.slug?.current || 'N/A'}`);
      console.log(`     Published: ${post.datePublished || 'N/A'}`);
    });
    
  } catch (error) {
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Response:', error.response);
    }
  }
}

test();
