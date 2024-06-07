<template>
  <div>
    <About />
    <section id="posts">
      <h2>Recent Posts</h2>
      <BlogPost title="Post Title 1" summary="Summary of the blog post..." id="1" />
      <BlogPost title="Post Title 2" summary="Summary of the blog post..." id="2" />
    </section>
  </div>
</template>

<script setup>
import BlogPost from '../components/BlogPost.vue'

</script>

<style scoped>
section {
  margin-bottom: 2rem;
}
</style>
