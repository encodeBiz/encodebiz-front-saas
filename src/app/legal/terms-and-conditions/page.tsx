// pages/terminos-condiciones.js o components/TerminosCondiciones.js
import React from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Link,
  Divider,
  Chip,
  Button,
  Alert,
  Card,
  CardContent
} from '@mui/material';
import {
  Gavel,
  Security,
  AccountCircle,
  Payment,
  Cancel,
  Warning,
  Info,
  CheckCircle,
  Assignment,
  ContactSupport
} from '@mui/icons-material';
 
const TerminosCondiciones = () => {
  const fechaVigencia = '1 de Enero, 2024';

  return (
    <>
     

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header */}
        <Box textAlign="center" mb={6}>
          <Chip 
            icon={<Gavel />} 
            label="Términos Legales" 
            color="primary" 
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
            Términos y Condiciones
          </Typography>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Vigente desde: {fechaVigencia}
          </Typography>
          
          <Alert severity="info" sx={{ mt: 2, maxWidth: 800, mx: 'auto' }}>
            <strong>Importante:</strong> Por favor, lea detenidamente estos términos antes de utilizar nuestros servicios.
          </Alert>
        </Box>

        <Paper elevation={2} sx={{ p: 4, mb: 4 }}>
          {/* Aceptación de términos */}
          <Box mb={4}>
            <Typography variant="h5" component="h2" gutterBottom color="primary">
              <CheckCircle sx={{ verticalAlign: 'middle', mr: 1 }} />
              1. Aceptación de los Términos
            </Typography>
            <Typography variant="body1" paragraph>
              Al acceder y utilizar los servicios de <strong>Mi Empresa</strong>, usted acepta 
              estar legalmente vinculado por estos Términos y Condiciones. Si no está de acuerdo 
              con alguna parte de estos términos, no podrá utilizar nuestros servicios.
            </Typography>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Definiciones */}
          <Box mb={4}>
            <Typography variant="h5" component="h2" gutterBottom color="primary">
              <Assignment sx={{ verticalAlign: 'middle', mr: 1 }} />
              2. Definiciones
            </Typography>
            
            <Box component="ul" sx={{ pl: 2 }}>
              <Typography component="li" paragraph>
                <strong>Servicio:</strong> Sitio web, aplicaciones y servicios proporcionados por Mi Empresa
              </Typography>
              <Typography component="li" paragraph>
                <strong>Usuario:</strong> Persona que accede o utiliza el Servicio
              </Typography>
              <Typography component="li" paragraph>
                <strong>Contenido:</strong> Texto, imágenes, videos y otros materiales disponibles en el Servicio
              </Typography>
              <Typography component="li" paragraph>
                <strong>Cuenta:</strong> Perfil de usuario registrado en nuestro sistema
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Registro y Cuenta */}
          <Box mb={4}>
            <Typography variant="h5" component="h2" gutterBottom color="primary">
              <AccountCircle sx={{ verticalAlign: 'middle', mr: 1 }} />
              3. Registro y Cuenta de Usuario
            </Typography>
            
            <List>
              <ListItem>
                <ListItemIcon>
                  <Info color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Información Veraz" 
                  secondary="Debe proporcionar información precisa y completa durante el registro." 
                />
              </ListItem>
              
              <ListItem>
                <ListItemIcon>
                  <Security color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Seguridad de la Cuenta" 
                  secondary="Es responsable de mantener la confidencialidad de su contraseña y cuenta." 
                />
              </ListItem>
              
              <ListItem>
                <ListItemIcon>
                  <Warning color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Uso Personal" 
                  secondary="Su cuenta es personal e intransferible. No puede cederla a terceros." 
                />
              </ListItem>
            </List>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Uso del Servicio */}
          <Box mb={4}>
            <Typography variant="h5" component="h2" gutterBottom color="primary">
              4. Uso Aceptable del Servicio
            </Typography>
            
            <Box display="grid" gridTemplateColumns="repeat(auto-fit, minmax(300px, 1fr))" gap={3} mt={2}>
              <Card variant="outlined" sx={{ borderColor: 'success.main' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom color="success.main">
                    Conductas Permitidas
                  </Typography>
                  <Box component="ul" sx={{ pl: 2 }}>
                    <Typography component="li" variant="body2">
                      Uso personal y no comercial
                    </Typography>
                    <Typography component="li" variant="body2">
                      Compartir contenido respetando derechos de autor
                    </Typography>
                    <Typography component="li" variant="body2">
                      Participar en comunidades de forma respetuosa
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
              
              <Card variant="outlined" sx={{ borderColor: 'error.main' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom color="error.main">
                    Conductas Prohibidas
                  </Typography>
                  <Box component="ul" sx={{ pl: 2 }}>
                    <Typography component="li" variant="body2">
                      Actividades ilegales o fraudulentas
                    </Typography>
                    <Typography component="li" variant="body2">
                      Acoso o discurso de odio
                    </Typography>
                    <Typography component="li" variant="body2">
                      Spam o publicidad no autorizada
                    </Typography>
                    <Typography component="li" variant="body2">
                      Violación de derechos de propiedad intelectual
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Propiedad Intelectual */}
          <Box mb={4}>
            <Typography variant="h5" component="h2" gutterBottom color="primary">
              5. Propiedad Intelectual
            </Typography>
            
            <Typography variant="body1" paragraph>
              Todo el contenido, logotipos, marcas registradas y otros materiales disponibles 
              en el Servicio son propiedad de <strong>Mi Empresa</strong> o de sus licenciantes 
              y están protegidos por leyes de propiedad intelectual.
            </Typography>
            
            <Alert severity="warning" sx={{ mt: 2 }}>
              <strong>Restricciones:</strong> No puede copiar, modificar, distribuir o utilizar 
              nuestro contenido sin autorización expresa por escrito.
            </Alert>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Pagos y Facturación */}
          <Box mb={4}>
            <Typography variant="h5" component="h2" gutterBottom color="primary">
              <Payment sx={{ verticalAlign: 'middle', mr: 1 }} />
              6. Pagos y Facturación
            </Typography>
            
            <List>
              <ListItem>
                <ListItemText 
                  primary="Suscripciones de Pago" 
                  secondary="Algunos servicios pueden requerir suscripción de pago recurrente." 
                />
              </ListItem>
              
              <ListItem>
                <ListItemText 
                  primary="Facturación Automática" 
                  secondary="Las suscripciones se renuevan automáticamente al final de cada período." 
                />
              </ListItem>
              
              <ListItem>
                <ListItemText 
                  primary="Cancelación" 
                  secondary="Puede cancelar su suscripción en cualquier momento desde su panel de control." 
                />
              </ListItem>
              
              <ListItem>
                <ListItemText 
                  primary="Reembolsos" 
                  secondary="Los reembolsos se evalúan caso por caso según nuestra política de reembolsos." 
                />
              </ListItem>
            </List>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Limitación de Responsabilidad */}
          <Box mb={4}>
            <Typography variant="h5" component="h2" gutterBottom color="primary">
              <Cancel sx={{ verticalAlign: 'middle', mr: 1 }} />
              7. Limitación de Responsabilidad
            </Typography>
            
            <Typography variant="body1" paragraph>
              En la máxima medida permitida por la ley aplicable, <strong>Mi Empresa</strong> no 
              será responsable por:
            </Typography>
            
            <Box component="ul" sx={{ pl: 2 }}>
              <Typography component="li" paragraph>
                Daños indirectos, incidentales o consecuentes
              </Typography>
              <Typography component="li" paragraph>
                Pérdida de datos o interrupción del negocio
              </Typography>
              <Typography component="li" paragraph>
                Contenido de terceros enlazado desde nuestro servicio
              </Typography>
              <Typography component="li" paragraph>
                Actos de fuerza mayor o eventos fuera de nuestro control
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Terminación */}
          <Box mb={4}>
            <Typography variant="h5" component="h2" gutterBottom color="primary">
              8. Terminación del Servicio
            </Typography>
            
            <Typography variant="body1" paragraph>
              Podemos suspender o terminar su acceso al Servicio inmediatamente, sin previo 
              aviso o responsabilidad, si incumple estos Términos y Condiciones.
            </Typography>
            
            <Box display="flex" gap={2} flexWrap="wrap" mt={2}>
              <Chip label="Violación de Términos" color="error" variant="outlined" />
              <Chip label="Actividades Fraudulentas" color="error" variant="outlined" />
              <Chip label="Uso No Autorizado" color="error" variant="outlined" />
              <Chip label="Requisitos Legales" color="error" variant="outlined" />
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Ley Aplicable */}
          <Box mb={4}>
            <Typography variant="h5" component="h2" gutterBottom color="primary">
              9. Ley Aplicable y Jurisdicción
            </Typography>
            
            <Typography variant="body1" paragraph>
              Estos Términos se regirán e interpretarán de acuerdo con las leyes de 
              [País/Su País], sin tener en cuenta sus disposiciones sobre conflicto de leyes.
            </Typography>
            
            <Typography variant="body1" paragraph>
              Cualquier disputa relacionada con estos Términos se someterá a la jurisdicción 
              exclusiva de los tribunales de [Ciudad, País].
            </Typography>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Cambios en los Términos */}
          <Box mb={4}>
            <Typography variant="h5" component="h2" gutterBottom color="primary">
              10. Modificaciones de los Términos
            </Typography>
            
            <Typography variant="body1" paragraph>
              Nos reservamos el derecho de modificar estos Términos en cualquier momento. 
              Le notificaremos sobre cambios significativos mediante:
            </Typography>
            
            <Box component="ul" sx={{ pl: 2 }}>
              <Typography component="li" paragraph>
                Notificación por email a la dirección registrada
              </Typography>
              <Typography component="li" paragraph>
                Aviso prominente en nuestro sitio web
              </Typography>
              <Typography component="li" paragraph>
                Actualización de la fecha de Vigente desde
              </Typography>
            </Box>
            
            <Alert severity="warning" sx={{ mt: 2 }}>
              El uso continuado del Servicio después de los cambios constituye la aceptación 
              de los nuevos Términos.
            </Alert>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Contacto */}
          <Box textAlign="center">
            <Typography variant="h5" component="h2" gutterBottom color="primary">
              <ContactSupport sx={{ verticalAlign: 'middle', mr: 1 }} />
              Contacto
            </Typography>
            
            <Typography variant="body1" paragraph>
              Si tiene preguntas sobre estos Términos y Condiciones, contáctenos:
            </Typography>
            
            <Box display="flex" justifyContent="center" gap={2} flexWrap="wrap" mt={3}>
              <Button 
                variant="contained" 
                color="primary"
                href="mailto:legal@miempresa.com"
                startIcon={<ContactSupport />}
              >
                Email Legal
              </Button>
              
              <Button 
                variant="outlined" 
                color="primary"
                href="/contacto"
              >
                Formulario de Contacto
              </Button>
            </Box>
            
            <Box mt={3} p={2} bgcolor="grey.50" borderRadius={1}>
              <Typography variant="body2" color="text.secondary">
                <strong>Departamento Legal</strong>
                <br />
                Mi Empresa S.A.
                <br />
                Calle Ejemplo 123, Ciudad, País
                <br />
                Teléfono: +1 (555) 123-4567
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* Aviso Final */}
        <Alert severity="success" sx={{ mb: 4 }}>
          <Typography variant="body1">
            Al utilizar nuestros servicios, usted reconoce haber leído, entendido y aceptado 
            estos Términos y Condiciones en su totalidad.
          </Typography>
        </Alert>

        {/* Footer */}
        <Box textAlign="center" mt={4}>
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} Mi Empresa. Todos los derechos reservados.
            <br />
            <Link href="/politica-privacidad" color="inherit">
              Política de Privacidad
            </Link>
            {' | '}
            <Link href="/politica-cookies" color="inherit">
              Política de Cookies
            </Link>
            {' | '}
            <Link href="/terminos-servicio" color="inherit">
              Términos de Servicio
            </Link>
          </Typography>
        </Box>
      </Container>
    </>
  );
};

export default function TerminosCondicionesPage() {
  return (<TerminosCondiciones />);
}
