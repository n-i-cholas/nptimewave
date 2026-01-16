import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  to: string;
  delay?: number;
  badge?: string;
}

const FeatureCard = ({ title, description, icon, to, delay = 0, badge }: FeatureCardProps) => {
  return (
    <Link
      to={to}
      className="np-card-interactive group p-6 flex flex-col items-center text-center gap-4 animate-fade-in-up"
      style={{ animationDelay: `${delay}ms`, opacity: 0 }}
    >
      {/* Badge */}
      {badge && (
        <div className="absolute top-4 right-4 px-2 py-1 bg-primary/20 text-primary text-xs font-bold rounded-full animate-pulse">
          {badge}
        </div>
      )}

      {/* Icon Container */}
      <div className="relative w-32 h-32 rounded-2xl bg-card border border-border overflow-hidden flex items-center justify-center group-hover:border-primary/50 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-primary/20">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="transition-transform duration-300 group-hover:scale-110">
          {icon}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-2">
        <h3 className="font-display text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
          {title}
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {description}
        </p>
      </div>

      {/* CTA */}
      <div className="flex items-center gap-2 text-primary font-medium mt-2 group-hover:gap-3 transition-all duration-300">
        <span>Explore</span>
        <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
      </div>

      {/* Hover glow effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/5 to-cyan-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </Link>
  );
};

export default FeatureCard;
