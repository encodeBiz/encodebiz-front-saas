'use client'

import React from 'react';
import {
  Container
} from '@mui/material';

const TerminosCondicionesPage = () => {

  return (
    <>


      <Container maxWidth="lg" sx={{ py: 4 }}>
        <div className="container">
          <header>
            <h1>Términos y Condiciones</h1>
            <p><strong>Última actualización:</strong> 8 de octubre de 2025</p>
          </header>

          <main>
            <section id="introduccion">
              <h2>1. Introducción</h2>
              <p>Bienvenido a [Nombre de la Empresa/Sitio Web]. Al acceder y utilizar nuestro sitio web, usted acepta estar sujeto a los siguientes términos y condiciones. Si no está de acuerdo con alguna parte de estos términos, por favor, no utilice nuestro servicio.</p>
            </section>

            <section id="uso-del-servicio">
              <h2>2. Uso del servicio</h2>
              <p>El uso de este sitio web está sujeto a las siguientes condiciones:</p>
              <ul>
                <li>El contenido de las páginas de este sitio web es para su información y uso general únicamente. Está sujeto a cambios sin previo aviso.</li>
                <li>No garantizamos la precisión, actualidad, rendimiento, integridad o adecuación de la información y los materiales encontrados u ofrecidos en este sitio web para un propósito particular.</li>
                <li>Su uso de cualquier información o material en este sitio web es bajo su propio riesgo, para lo cual no seremos responsables. Será su propia responsabilidad asegurarse de que cualquier producto, servicio o información disponible a través de este sitio web cumpla con sus requisitos específicos.</li>
              </ul>
            </section>

            <section id="propiedad-intelectual">
              <h2>3. Propiedad intelectual</h2>
              <p>Este sitio web contiene material que es propiedad nuestra o nos ha sido otorgado bajo licencia. Este material incluye, pero no se limita a, el diseño, la disposición, el aspecto, la apariencia y los gráficos. La reproducción está prohibida salvo de conformidad con el aviso de derechos de autor, que forma parte de estos términos y condiciones.</p>
            </section>

            <section id="enlaces-a-terceros">
              <h2>4. Enlaces a otros sitios web</h2>
              <p>De vez en cuando, este sitio web puede incluir enlaces a otros sitios web. Estos enlaces se proporcionan para su conveniencia y para proporcionar información adicional. No significan que respaldamos los sitios web. No tenemos ninguna responsabilidad por el contenido de los sitios web enlazados.</p>
            </section>

            <section id="limitacion-de-responsabilidad">
              <h2>5. Limitación de responsabilidad</h2>
              <p>En la máxima medida permitida por la ley, [Nombre de la Empresa/Sitio Web] no será responsable de ningún daño directo, indirecto, incidental, especial, consecuente o punitivo, incluyendo, pero no limitado a, la pérdida de beneficios, datos, uso, buena voluntad u otras pérdidas intangibles, resultantes de (i) su acceso o uso de nuestro servicio; (ii) cualquier conducta o contenido de cualquier tercero en el servicio.</p>
            </section>

            <section id="modificaciones">
              <h2>6. Modificaciones de los términos</h2>
              <p>Nos reservamos el derecho, a nuestra entera discreción, de modificar o reemplazar estos Términos en cualquier momento. Si una revisión es material, intentaremos proporcionar un aviso con al menos 30 días de antelación antes de que los nuevos términos entren en vigor.</p>
            </section>
          </main>

          <footer>
            <p>Para más información, contáctenos en <a href="mailto:contacto@ejemplo.com">contacto@ejemplo.com</a>.</p>
          </footer>
        </div>
      </Container>
    </>
  );
};

export default TerminosCondicionesPage