import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  to: string;
  delay?: number;
}

const FeatureCard = ({ title, description, icon, to, delay = 0 }: FeatureCardProps) => {
  return (
    <Link
      to={to}
      className="np-card-interactive group p-6 flex flex-col items-center text-center gap-4 animate-slide-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="w-32 h-32 rounded-2xl bg-card border border-border overflow-hidden flex items-center justify-center group-hover:border-primary/50 transition-colors duration-300">
        {icon}
      </div>
      <h3 className="font-display text-xl font-bold text-foreground">{title}</h3>
      <p className="text-muted-foreground text-sm">{description}</p>
      <div className="flex items-center gap-2 text-primary font-medium mt-2 group-hover:gap-3 transition-all duration-300">
        <span>Explore</span>
        <ArrowRight className="w-4 h-4" />
      </div>
    </Link>
  );
};

export default FeatureCard;
