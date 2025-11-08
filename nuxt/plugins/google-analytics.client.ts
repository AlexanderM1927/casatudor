export default defineNuxtPlugin(() => {
  // Agregar el script de Google Analytics
  useHead({
    script: [
      {
        src: 'https://www.googletagmanager.com/gtag/js?id=G-9PWB8611D3',
        async: true,
      },
      {
        innerHTML: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-9PWB8611D3');
        `,
        type: 'text/javascript',
      },
    ],
  });
});
