import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useMemories } from '@/hooks/useGameData';
import { ArrowLeft, Check, Sparkles, AlertCircle, LogIn } from 'lucide-react';
import ImageUpload from '@/components/ImageUpload';

const memoryThemes = ['Campus Life', 'Friendships', 'Achievements', 'Traditions', 'Learning', 'Events', 'Teachers', 'Other'];
const memoryRoles = ['Student', 'Alumni', 'Staff', 'Faculty', 'Visitor'];

const MemorySubmit = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { submitMemory } = useMemories();

  const [formData, setFormData] = useState({
    title: '',
    story: '',
    decade: '',
    theme: '',
    role: '',
    author_name: '',
    anonymous: false,
    image_url: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const decades = ['1960s', '1970s', '1980s', '1990s', '2000s', '2010s', '2020s'];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.story.trim()) newErrors.story = 'Story is required';
    if (formData.story.length < 50) newErrors.story = 'Story should be at least 50 characters';
    if (!formData.decade) newErrors.decade = 'Please select a decade';
    if (!formData.anonymous && !formData.author_name.trim()) {
      newErrors.author_name = 'Name is required (or choose anonymous)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);

    const { error } = await submitMemory({
      title: formData.title,
      story: formData.story,
      decade: formData.decade,
      theme: formData.theme || null,
      role: formData.role || null,
      image_url: formData.image_url || null,
      anonymous: formData.anonymous,
      author_name: formData.anonymous ? null : formData.author_name,
    });

    setIsSubmitting(false);

    if (error) {
      setErrors({ submit: error.message });
    } else {
      setSubmitted(true);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-background">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <LogIn className="w-10 h-10 text-primary" />
          </div>
          <h2 className="font-display text-2xl font-bold text-foreground mb-4">
            Sign In to Share
          </h2>
          <p className="text-muted-foreground mb-8">
            Create an account or sign in to share your NP memory with the community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/memory-portal" className="np-button-secondary">
              Browse Memories
            </Link>
            <Link to="/auth" className="np-button-primary inline-flex items-center gap-2">
              <LogIn className="w-5 h-5" />
              Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-background">
        <div className="text-center max-w-md mx-auto px-4 animate-bounce-in">
          <div className="w-24 h-24 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-12 h-12 text-success" />
          </div>
          <h2 className="font-display text-3xl font-bold text-foreground mb-4">
            Thank You! 🎉
          </h2>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            Your memory has been submitted for review. It will appear in the Memory Portal
            once approved. Thank you for sharing your NP story!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/memory-portal" className="np-button-secondary">
              Browse Memories
            </Link>
            <button
              onClick={() => {
                setSubmitted(false);
                setFormData({
                  title: '',
                  story: '',
                  decade: '',
                  theme: '',
                  role: '',
                  author_name: '',
                  anonymous: false,
                  image_url: '',
                });
              }}
              className="np-button-primary"
            >
              Submit Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-12 bg-background">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Back Button */}
        <div className="py-6 animate-fade-in">
          <Link
            to="/memory-portal"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Back to Memory Portal
          </Link>
        </div>

        {/* Form */}
        <div className="np-card p-8 animate-fade-in-up" style={{ opacity: 0 }}>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <h1 className="font-display text-3xl font-bold text-foreground">
              Share Your Memory
            </h1>
          </div>
          <p className="text-muted-foreground mb-8 ml-13">
            Tell us about your NP experience. Your story becomes part of our heritage.
          </p>

          {errors.submit && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive">
              {errors.submit}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-foreground font-medium mb-2">
                Memory Title <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Give your memory a title"
                className={`np-input ${errors.title ? 'ring-2 ring-destructive' : ''}`}
              />
              {errors.title && (
                <p className="text-destructive text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.title}
                </p>
              )}
            </div>

            {/* Story */}
            <div>
              <label className="block text-foreground font-medium mb-2">
                Your Story <span className="text-destructive">*</span>
              </label>
              <textarea
                rows={6}
                value={formData.story}
                onChange={(e) => setFormData({ ...formData, story: e.target.value })}
                placeholder="Share the details of your memory... What happened? Who was there? What made it special?"
                className={`np-input resize-none ${errors.story ? 'ring-2 ring-destructive' : ''}`}
              />
              <div className="flex justify-between mt-1">
                {errors.story ? (
                  <p className="text-destructive text-sm flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.story}
                  </p>
                ) : (
                  <span />
                )}
                <span className={`text-sm ${formData.story.length < 50 ? 'text-muted-foreground' : 'text-success'}`}>
                  {formData.story.length} characters
                </span>
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-foreground font-medium mb-2">
                Add a Photo <span className="text-muted-foreground text-sm">(optional)</span>
              </label>
              <ImageUpload
                onUploadComplete={(url) => setFormData({ ...formData, image_url: url })}
                currentImageUrl={formData.image_url}
                onRemove={() => setFormData({ ...formData, image_url: '' })}
              />
              <p className="text-sm text-muted-foreground mt-2">
                Add a photo to bring your memory to life
              </p>
            </div>

            {/* Decade and Theme Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Decade */}
              <div>
                <label className="block text-foreground font-medium mb-2">
                  Time Period <span className="text-destructive">*</span>
                </label>
                <select
                  value={formData.decade}
                  onChange={(e) => setFormData({ ...formData, decade: e.target.value })}
                  className={`np-input ${errors.decade ? 'ring-2 ring-destructive' : ''}`}
                >
                  <option value="">Select a decade</option>
                  {decades.map((decade) => (
                    <option key={decade} value={decade}>
                      {decade}
                    </option>
                  ))}
                </select>
                {errors.decade && (
                  <p className="text-destructive text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.decade}
                  </p>
                )}
              </div>

              {/* Theme */}
              <div>
                <label className="block text-foreground font-medium mb-2">
                  Theme <span className="text-muted-foreground text-sm">(optional)</span>
                </label>
                <select
                  value={formData.theme}
                  onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                  className="np-input"
                >
                  <option value="">Select a theme</option>
                  {memoryThemes.map((theme) => (
                    <option key={theme} value={theme}>
                      {theme}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Role */}
            <div>
              <label className="block text-foreground font-medium mb-2">
                Your Role <span className="text-muted-foreground text-sm">(optional)</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {memoryRoles.map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setFormData({ ...formData, role: formData.role === role ? '' : role })}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      formData.role === role
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-foreground hover:bg-secondary/80'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            {/* Anonymous Toggle */}
            <div className="flex items-center gap-3 p-4 bg-secondary/50 rounded-xl">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, anonymous: !formData.anonymous })}
                className={`w-12 h-6 rounded-full transition-all duration-300 relative ${
                  formData.anonymous ? 'bg-primary' : 'bg-muted'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-md transition-all duration-300 absolute top-0.5 ${
                    formData.anonymous ? 'left-6' : 'left-0.5'
                  }`}
                />
              </button>
              <div>
                <span className="text-foreground font-medium">Post anonymously</span>
                <p className="text-muted-foreground text-sm">Your name won't be displayed</p>
              </div>
            </div>

            {/* Author Name */}
            {!formData.anonymous && (
              <div className="animate-fade-in">
                <label className="block text-foreground font-medium mb-2">
                  Your Name <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={formData.author_name}
                  onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                  placeholder="How should we credit you?"
                  className={`np-input ${errors.author_name ? 'ring-2 ring-destructive' : ''}`}
                />
                {errors.author_name && (
                  <p className="text-destructive text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.author_name}
                  </p>
                )}
              </div>
            )}

            {/* Review Notice */}
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">📝 Note:</strong> All submissions are reviewed before publishing
                to ensure they align with our community guidelines. This usually takes 1-2 business days.
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full np-button-primary py-4 text-lg flex items-center justify-center gap-2 ${
                isSubmitting ? 'opacity-70 cursor-wait' : ''
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Submit Memory
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MemorySubmit;