import { useCMS } from '@/contexts/CMSContext';
import { CMSPageShell } from '@/components/admin/CMSPageShell';
import { CRUDList } from '@/components/admin/CRUDList';

export default function AdminCMSFestivals() {
  const { content, update } = useCMS();
  return (
    <CMSPageShell title="Festivals" description="Cultural calendar shown on the public Festivals page.">
      <CRUDList
        items={content.festivals}
        onChange={(festivals) => update('festivals', festivals)}
        fields={[
          { key: 'name', label: 'Festival name' },
          { key: 'month', label: 'Month' },
          { key: 'region', label: 'Region' },
          { key: 'imageUrl', label: 'Image URL' },
          { key: 'description', label: 'Description', type: 'textarea' },
          { key: 'featured', label: 'Featured', type: 'switch' },
        ]}
        defaults={{ name: 'New festival', month: 'January', region: '', description: '', imageUrl: '/placeholder.svg', featured: false } as any}
        addLabel="Add festival"
      />
    </CMSPageShell>
  );
}
