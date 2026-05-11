import { useHostData } from '@/contexts/HostDataContext';
import { CMSPageShell } from '@/components/admin/CMSPageShell';
import { CRUDList } from '@/components/admin/CRUDList';

export default function HostExperiences() {
  const { data, update } = useHostData();
  return (
    <CMSPageShell title="My Experiences" description="Add-on activities you offer to guests.">
      <CRUDList
        items={data.experiences}
        onChange={(experiences) => update('experiences', experiences)}
        fields={[
          { key: 'title', label: 'Title' },
          { key: 'duration', label: 'Duration' },
          { key: 'price', label: 'Price (NPR)', type: 'number' },
          { key: 'maxGuests', label: 'Max guests', type: 'number' },
          { key: 'imageUrl', label: 'Image URL' },
          { key: 'description', label: 'Description', type: 'textarea' },
        ]}
        defaults={{ title: 'New experience', description: '', price: 1000, duration: '2 hours', maxGuests: 4, imageUrl: '/placeholder.svg' } as any}
        addLabel="Add experience"
      />
    </CMSPageShell>
  );
}
