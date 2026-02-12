import { motion } from 'framer-motion';
import { Award, Globe, Briefcase, Clock, MessageCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface HostProfileProps {
  host: {
    name: string;
    since: string;
    responseRate: number;
    responseTime: string;
    isSuperhost: boolean;
    bio: string;
    languages: string[];
    expertise: string[];
  };
}

export function HostProfile({ host }: HostProfileProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="pb-8 border-b border-border"
    >
      <h3 className="font-display text-2xl font-semibold text-foreground mb-6">
        Meet your host
      </h3>

      <div className="bg-muted/30 rounded-2xl p-6 md:p-8">
        <div className="flex items-start gap-5 mb-5">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary font-display font-bold text-2xl flex-shrink-0">
            {host.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-display text-xl font-semibold text-foreground">{host.name}</h4>
              {host.isSuperhost && (
                <Badge variant="secondary" className="gap-1">
                  <Award className="w-3 h-3" />
                  Superhost
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-1">Hosting since {host.since}</p>
          </div>
        </div>

        <p className="text-foreground/80 leading-relaxed mb-6">{host.bio}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="flex items-start gap-3">
            <Globe className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-foreground">Languages</p>
              <p className="text-sm text-muted-foreground">{host.languages.join(', ')}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MessageCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-foreground">Response</p>
              <p className="text-sm text-muted-foreground">{host.responseRate}% · {host.responseTime}</p>
            </div>
          </div>
        </div>

        {host.expertise.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Briefcase className="w-5 h-5 text-primary" />
              <p className="text-sm font-medium text-foreground">Expertise</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {host.expertise.map(skill => (
                <Badge key={skill} variant="outline" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
