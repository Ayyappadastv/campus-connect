import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  GraduationCap,
  MessageSquare,
  CheckCircle2,
  Clock,
  Shield,
  ArrowRight,
  Zap,
  Users,
  BarChart3,
} from 'lucide-react';

export default function Landing() {
  const features = [
    {
      icon: MessageSquare,
      title: 'Easy Reporting',
      description: 'Submit issues in seconds with our intuitive form. Add descriptions, photos, and location details.',
    },
    {
      icon: Clock,
      title: 'Real-time Tracking',
      description: 'Follow the status of your reports from submission to resolution with live updates.',
    },
    {
      icon: CheckCircle2,
      title: 'Quick Resolution',
      description: 'Our admin team prioritizes and assigns issues to ensure fast, efficient solutions.',
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your data is protected with enterprise-grade security and privacy measures.',
    },
  ];

  const stats = [
    { value: '500+', label: 'Issues Resolved' },
    { value: '24h', label: 'Avg. Response Time' },
    { value: '98%', label: 'Satisfaction Rate' },
    { value: '50+', label: 'Active Admins' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg gradient-primary flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl text-foreground">CampusResolve</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost">Log in</Button>
            </Link>
            <Link to="/signup">
              <Button variant="hero">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 animate-fade-in">
            <Zap className="h-4 w-4" />
            Streamlined Campus Problem Management
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground max-w-4xl mx-auto leading-tight animate-slide-up">
            Report Campus Issues,{' '}
            <span className="text-primary">Get Them Resolved</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mt-6 animate-slide-up" style={{ animationDelay: '100ms' }}>
            A seamless platform for students to report infrastructure, IT, hostel, and academic issues. 
            Track progress and get timely resolutions.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10 animate-slide-up" style={{ animationDelay: '200ms' }}>
            <Link to="/signup">
              <Button variant="hero" size="xl" className="gap-2">
                Report an Issue
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="xl">
                Admin Login
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-secondary/50">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                <p className="text-3xl md:text-4xl font-bold text-primary">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Everything You Need to Report & Track Issues
            </h2>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
              Our platform makes it easy to report campus problems and follow their resolution journey.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border-border hover:border-primary/30 transition-all duration-300 hover:shadow-elevated animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-secondary/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              How It Works
            </h2>
            <p className="text-muted-foreground mt-4">
              Three simple steps to get your campus issues resolved
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: '01', title: 'Submit Report', description: 'Describe your issue, add photos, and select the category.' },
              { step: '02', title: 'Track Progress', description: 'Monitor the status as admins review and assign your report.' },
              { step: '03', title: 'Get Resolved', description: 'Receive updates and confirmation when your issue is fixed.' },
            ].map((item, index) => (
              <div key={index} className="text-center animate-fade-in" style={{ animationDelay: `${index * 150}ms` }}>
                <div className="h-16 w-16 rounded-2xl gradient-primary text-primary-foreground text-2xl font-bold flex items-center justify-center mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <Card className="gradient-hero border-0 overflow-hidden">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
                Ready to Report an Issue?
              </h2>
              <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
                Join hundreds of students who are making their campus a better place.
              </p>
              <Link to="/signup">
                <Button size="xl" className="bg-card text-primary hover:bg-card/90">
                  Get Started Free
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center">
              <GraduationCap className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground">CampusResolve</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 CampusResolve. Making campuses better, one report at a time.
          </p>
        </div>
      </footer>
    </div>
  );
}
