import { useCMS } from '@/contexts/CMSContext';
import { CMSPageShell } from '@/components/admin/CMSPageShell';
import { CRUDList } from '@/components/admin/CRUDList';

export default function AdminCMSBlogs() {
  const { content, update } = useCMS();
  return (
    <CMSPageShell title="Blog" description="Author and publish blog posts.">
      <CRUDList
        items={content.blogs}
        onChange={(blogs) => update('blogs', blogs)}
        fields={[
          { key: 'title', label: 'Title' },
          { key: 'slug', label: 'Slug' },
          { key: 'author', label: 'Author' },
          { key: 'publishedAt', label: 'Published date' },
          { key: 'coverUrl', label: 'Cover image URL' },
          { key: 'excerpt', label: 'Excerpt', type: 'textarea' },
          { key: 'body', label: 'Body (Markdown)', type: 'textarea' },
          { key: 'published', label: 'Published', type: 'switch' },
        ]}
        defaults={{ title: 'Untitled post', slug: 'untitled', author: 'Editor', publishedAt: new Date().toISOString().slice(0,10), coverUrl: '/placeholder.svg', excerpt: '', body: '', tags: [], published: false } as any}
        addLabel="New post"
      />
    </CMSPageShell>
  );
}
