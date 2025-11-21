import Link from 'next/link';
import { ArrowRight, Home, Shield, Users, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative flex items-center justify-center min-h-[calc(100vh-4rem)] overflow-hidden">
        {/* Background image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(https://images.pexels.com/photos/32398217/pexels-photo-32398217/free-photo-of-fotos-de-dron-de-una-piscina-en-medio-de-una-montana-en-sri-lanka.jpeg)'
          }}
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/40" />
        {/* Background pattern */}
        <div className="absolute inset-0 bg-grid-slate-200 dark:bg-grid-slate-800 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.3))] dark:[mask-image:linear-gradient(0deg,black,rgba(0,0,0,0.3))]" />
        
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium border border-white/30">
              <Sparkles className="h-4 w-4" />
              Tu nueva vida junto al mar comienza aquí
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold leading-tight text-white">
              Encuentra tu
              <span className="bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
                {' '}Paraíso Costero
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto">
              Descubre propiedades exclusivas en las mejores zonas costeras de México. 
              Vive el estilo de vida que siempre soñaste.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/propiedades">
                <Button size="lg" className="text-lg px-8 h-14 rounded-full">
                  Ver Propiedades
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/contacto">
                <Button size="lg" variant="outline" className="text-lg px-8 h-14 rounded-full">
                  Contáctanos
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-bold">¿Por qué elegir CostaSuite?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Somos tu aliado de confianza para encontrar la propiedad perfecta
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-blue-500 transition-colors">
              <CardContent className="pt-8 pb-6 text-center space-y-4">
                <div className="inline-flex p-4 rounded-full bg-blue-100 dark:bg-blue-900/30">
                  <Home className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-bold">Propiedades Exclusivas</h3>
                <p className="text-muted-foreground">
                  Accede a las mejores propiedades en zonas costeras premium con vistas espectaculares
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-cyan-500 transition-colors">
              <CardContent className="pt-8 pb-6 text-center space-y-4">
                <div className="inline-flex p-4 rounded-full bg-cyan-100 dark:bg-cyan-900/30">
                  <Shield className="h-8 w-8 text-cyan-600 dark:text-cyan-400" />
                </div>
                <h3 className="text-xl font-bold">Confianza Garantizada</h3>
                <p className="text-muted-foreground">
                  Todas nuestras propiedades están verificadas y cuentan con documentación legal completa
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-teal-500 transition-colors">
              <CardContent className="pt-8 pb-6 text-center space-y-4">
                <div className="inline-flex p-4 rounded-full bg-teal-100 dark:bg-teal-900/30">
                  <Users className="h-8 w-8 text-teal-600 dark:text-teal-400" />
                </div>
                <h3 className="text-xl font-bold">Asesoría Profesional</h3>
                <p className="text-muted-foreground">
                  Nuestro equipo de agentes expertos te acompaña en cada paso del proceso
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-cyan-600 text-white">
        <div className="container mx-auto px-4 text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold">
            ¿Listo para encontrar tu hogar ideal?
          </h2>
          <p className="text-xl md:text-2xl max-w-2xl mx-auto opacity-90">
            Explora nuestra selección de propiedades y da el primer paso hacia tu nueva vida
          </p>
          <Link href="/propiedades">
            <Button size="lg" variant="secondary" className="text-lg px-8 h-14 rounded-full">
              Explorar Propiedades
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
