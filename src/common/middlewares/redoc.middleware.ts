import redoc from 'redoc-express';
import { Ioption } from 'redoc-express/dist/redoc-html-template';

export function setupRedoc(app: any) {
  const redocOptions: Ioption = {
    title: 'Студенческий код',
    specUrl: '/swagger-json',
    redocOptions: {
      defaultSampleLanguage: 'JavaScript',
      ctrlFHijack: false,
      scrollYOffset: 80,
      theme: {
        codeBlock: {
          borderRadius: '8px',
        },
        typography: {
          fontSize: '16px',
          fontFamily: 'Roboto Mono, Roboto, sans-serif',
          optimizeSpeed: true,
          smoothing: 'antialiased',
          headings: {
            fontWeight: 'bold',
            lineHeight: '2em',
          },
        },
        sidebar: {
          width: '300px',
          textColor: '#000000',
          backgroundColor: '#ffffff',
          borderRadius: '8px',
        },
        rightPanel: {
          backgroundColor: 'rgba(249, 116, 22, 1)',
          textColor: '#ffffff',
        },
        shape: {
          borderRadius: '8px',
        },
        components: {
          buttons: {
            borderRadius: '8px',
          },
          httpBadges: {
            borderRadius: '8px',
          },
          panels: {
            borderRadius: '8px',
          },
        },
      },
    },
  };

  app.use('/docs', redoc(redocOptions));
}
