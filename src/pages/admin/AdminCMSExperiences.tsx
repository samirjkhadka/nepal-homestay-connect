import { useCMS } from '@/contexts/CMSContext';
import { CMSPageShell } from '@/components/admin/CMSPageShell';
import { CRUDList } from '@/components/admin/CRUDList';

export default function AdminCMSExperiences() {
  const { content, update } = useCMS();
  return (
    <CMSPageShell title="Experiences" description="Local experiences marketplace.">
      <CRUDList
        items={content.experiences}
        onChange={(experiences) => update('experiences', experiences)}
        fields={[
          { key: 'title', label: 'Title' },
          { key: 'host', label: 'Host' },
          { key: 'category', label: 'Category' },
          { key: 'duration', label: 'Duration' },
          { key: 'price', label: 'Price (NPR)', type: 'number' },
          { key: 'imageUrl', label: 'Image URL' },
        ]}
        defaults={{ title: 'New experience', host: '', category: 'Food', duration: '2 hours', price: 1000, imageUrl: '/placeholder.svg' } as any}
        addLabel="Add experience"
      />
    </CMSPageShell>
  );
}
