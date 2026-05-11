import { useCMS } from '@/contexts/CMSContext';
import { CMSPageShell } from '@/components/admin/CMSPageShell';
import { CRUDList } from '@/components/admin/CRUDList';

export default function AdminCMSTestimonials() {
  const { content, update } = useCMS();
  return (
    <CMSPageShell title="Testimonials" description="Guest stories on the homepage.">
      <CRUDList
        items={content.testimonials}
        onChange={(testimonials) => update('testimonials', testimonials)}
        fields={[
          { key: 'name', label: 'Guest name' },
          { key: 'location', label: 'Location' },
          { key: 'rating', label: 'Rating (1-5)', type: 'number' },
          { key: 'avatarUrl', label: 'Avatar URL' },
          { key: 'quote', label: 'Quote', type: 'textarea' },
        ]}
        defaults={{ name: 'New guest', location: '', rating: 5, avatarUrl: '', quote: '' } as any}
        addLabel="Add testimonial"
      />
    </CMSPageShell>
  );
}
