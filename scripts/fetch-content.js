const axios = require('axios');
const fs = require('fs');
const path = require('path');

async function fetchPosts() {
  try {
    const response = await axios.get('http://localhost:1337/api/posts');
    const posts = response.data.data;

    // Create the content directory if it doesn't exist
    const contentDir = path.join(__dirname, '..', 'content', 'posts');
    if (!fs.existsSync(contentDir)) {
      fs.mkdirSync(contentDir, { recursive: true });
    }

    // Create markdown files for each post
    posts.forEach(post => {
      const { Title, Slug, publishedAt, Content } = post;

      // Create markdown content
      const markdownContent = `
---
title: "${Title}"
slug: "${Slug}"
date: "${publishedAt}"
---

${Content.map(block => {
  if (block.type === 'paragraph') {
    return block.children.map(child => child.text).join('\n\n');
  }
  return '';
}).join('\n\n')}
      `;

      // Write the markdown file with the slug as the filename
      fs.writeFileSync(path.join(contentDir, `${Slug}.md`), markdownContent.trim());
      console.log(`Created markdown file for post: ${Title}`);
    });

  } catch (error) {
    console.error('Error fetching blog posts:', error);
  }
}

fetchPosts();
